import { AvailableSlostsQuery, CreateBookingInput, BookingResponse, ClientBookingResponse } from "../../types/booking-types";
import sql from 'mssql';
import { getPool } from "../../config/database";

//pomocne f-je za vracanje slobodnih termina
//f-ja za provjeru da li se termini poklapaju
function doTimesOverlap(startA: Date, endA: Date, startB: Date, endB: Date) : boolean{
    return startA < endB && endA > startB;
}

//f-ja za dodavanje vremena trajanja usluge na postojece vrijeme
function addMinutes(date: Date, minutes: number): Date{
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
}

export async function getAvailableSlots(query: AvailableSlostsQuery): Promise<string[]> {
    const pool = await getPool();

    //trazimo durationminutes iz services baze
    const serviceResult = await pool.request().input('serviceId', sql.Int, query.serviceId).query('SELECT DurationMinutes FROM Services WHERE Id = @serviceId');

    const durationMinutes = serviceResult.recordset[0].DurationMinutes;

    //definisemo radno vrijeme
    const startOfDay = new Date(`${query.date}T08:00:00`);
    const endOfDay = new Date(`${query.date}T17:00:00`);

    //postojece rezervacije zaposlenog
    const bookingsResult = await pool.request().input('employeeId', sql.Int, query.employeeId).input('startOfDay', sql.DateTime2, startOfDay).input('endOfDay', sql.DateTime2, endOfDay).query(`SELECT StartTime, EndTime FROM Bookings WHERE EmployeeId = @employeeId AND StartTime >= @startOfDay AND StartTime < @endOfDay`);

    const existingBookings = bookingsResult.recordset;

    //generisanje kandidate(moguce rezervacije)
    const availableSlots: string[] = [];
    let candidateStart = startOfDay;
    
    while(true){
        const candidateEnd = addMinutes(candidateStart, durationMinutes);

        //ako prelazi radno vrijeme
        if(candidateEnd > endOfDay){
            break;
        }
        const overlapsWithSmth = existingBookings.some((booking) => doTimesOverlap(candidateStart, candidateEnd, booking.StartTime, booking.EndTime));

        if(!overlapsWithSmth){
            availableSlots.push(candidateStart.toISOString());
        }
        //sljedeci prolaz ide tacno gdje prethodni stao, npr. od 8:30
        candidateStart = addMinutes(candidateStart, durationMinutes);
    }
    return availableSlots;
}

export async function createBooking(clientId: number, input: CreateBookingInput): Promise<BookingResponse> {
    
    const pool = await getPool();

    const serviceResult = await pool.request().input('serviceId', sql.Int, input.serviceId).query('SELECT DurationMinutes FROM Services WHERE Id = @serviceId');

    if(serviceResult.recordset.length === 0){
        throw new Error('Usluga ne postoji');
    }

    //sto stavljamo .durationminutes
    const durationMinutes = serviceResult.recordset[0].DurationMinutes;

    const startTime = new Date(input.startTime);
    const endTime = addMinutes(startTime, durationMinutes);

    //cast?? -> AND CAST (StartTime AS DATE)
    const bookingResult = await pool.request().input('employeeId', sql.Int, input.employeeId).input('startTime', sql.Date, startTime).query(`SELECT StartTime, EndTime FROM Bookings WHERE EmployeeId = @employeeId AND CAST (StartTime AS DATE) = CAST(@startTime AS DATE)`);

    const existingBookings = bookingResult.recordset.some((booking) => doTimesOverlap(startTime, endTime, booking.StartTime, booking.EndTime));

    if(!existingBookings){
        throw new Error('Termin je zauzet');
    }

    const result = await pool.request().input('clientId', sql.Int, clientId).input('employeeId', sql.Int, input.employeeId).input('serviceId', sql.Int, input.serviceId).input('startTime', sql.Date, input.startTime).input('endTime', sql.Date, endTime).query(`INSERT INTO Bookings(ClientId, EmployeeId, ServiceId, StartTime, EndTime)OUTPUT INSERTED.Id, INSERTED.EmployeeId, INSERTED.ServiceId, INSERTED.StartTime, INSERTED.EndTime VALUES (@clientId, @employeeId, @serviceId, @startTime, @endTime)`);

    const booking = result.recordset[0];

    return{
        id: booking.Id,
        employeeId: booking.EmployeeId,
        serviceId: booking.ServiceId,
        startTime: booking.StartTime.toISOString(),
        endTime: booking.EndTime.toISOString()
    };
}

//treba dodati join-ove za dohvatanje naziva usluga i zaposlenih
export async function getBookingsForClient(id: number): Promise<ClientBookingResponse[]> {
    const pool = await getPool();
    const bookingResult = await pool.request().input('id', sql.Int, id).query(`SELECT b.Id, b.StartTime, b.EndTime, s.Name AS ServiceName, e.Name AS EmployeeName FROM Bookings b INNER JOIN Services s ON b.ServiceId = s.Id INNER JOIN Employees e ON b.EmployeeId = e.Id WHERE b.ClientId = @id`);

    const bookings = bookingResult.recordset;

    return bookings.map((booking) => ({
        id: booking.Id,
        employeeName: booking.EmployeeName,
        serviceName: booking.ServiceName,
        startTime: booking.StartTime.toISOString(),
        endTime: booking.EndTime.toISOString(),
    }));
}

//treba dodati join-ove za dohvatanje naziva usluga i zaposlenih
export async function getAllBookings(): Promise<ClientBookingResponse[]> {
    const pool = await getPool();
    const bookingResult = await pool.request().query(`SELECT b.Id, b.StartTime, b.EndTime, s.Name AS ServiceName, e.Name AS EmployeeName FROM Bookings b INNER JOIN Services s ON b.ServiceId = s.Id INNER JOIN Employees e ON b.EmployeeId = e.Id ORDER BY NAME`);
    const bookings = bookingResult.recordset;

    return bookings.map((booking) => ({
        id: booking.Id,
        employeeName: booking.EmployeeName,
        serviceName: booking.ServiceName,
        startTime: booking.StartTime.toISOString(),
        endTime: booking.EndTime.toISOString()
    }));
}

export async function deleteBooking(id: number, clientId: number): Promise<void> {
    const pool = await getPool();
    const bookingResult = await pool.request().input('id', sql.Int, id).input('clientId', sql.Int, clientId).query('DELETE FROM Bookings WHERE Id = @id AND ClientId = @clientId');

    if(bookingResult.rowsAffected[0] === 0){
        throw new Error('Rezervacija ne postoji');
    }
}