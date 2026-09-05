import { ServiceResponse, CreateServiceInput, UpdateServiceInput } from "../../types/service-types";
import { getPool } from "../../config/database";
import sql from 'mssql';

//GET
//* -> [], service.Id
export async function getServices(): Promise<ServiceResponse[]>{

    const pool = await getPool();
    const result = await pool.request().query('SELECT Id, Name, DurationMinutes, Price FROM Services ORDER BY Name');

    return result.recordset.map((service) => ({
        id: service.Id,
        name: service.Name,
        durationMinutes: service.DurationMinutes,
        price: service.Price
    }));
}

//POST kreiranje

export async function createService(input: CreateServiceInput): Promise<ServiceResponse>{

    const pool = await getPool();
    const result = await pool.request().input('name', sql.NVarChar, input.name).input('durationMinutes', sql.Int, input.durationMinutes).input('price', sql.Decimal(10, 2), input.price).query('INSERT INTO Services (Name, DurationMinutes, Price) OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.DurationMinutes, INSERTED.Price VALUES (@name, @durationMinutes, @price)');

    const newService = result.recordset[0];

    return{
        id: newService.Id, 
        name: newService.Name,
        durationMinutes: newService.DurationMinutes,
        price: newService.Price,
    };
} 

export async function updateService(id:number, input: UpdateServiceInput): Promise<ServiceResponse> {
    
    const pool = await getPool();
    const existing = await pool.request().input('id', sql.Int, id).query('SELECT Id FROM Services WHERE Id = @id');

    if(existing.recordset.length === 0){
        throw new Error('Usluga ne postoji');
    }

    const result = await pool.request().input('id', sql.Int, id).input('name', sql.NVarChar, input.name).input('durationMinutes', sql.Int, input.durationMinutes).input('price', sql.Decimal(10, 2), input.price).query(`UPDATE Services SET Name = COALESCE(@name, Name), DurationMinutes = COALESCE(@durationMinutes, DurationMinutes), Price = COALESCE(@price, Price) OUTPUT  INSERTED.Id, INSERTED.Name, INSERTED.DurationMinutes, INSERTED.Price WHERE Id = @id`);

    const updated = result.recordset[0];

    return{
        id: updated.Id,
        name: updated.Name,
        durationMinutes: updated.DurationMinutes,
        price: updated.Price
    };
}

export async function deleteService(id: number): Promise<void> {
    
    const pool = await getPool();

    const bookingCheck = await pool.request().input('id', sql.Int, id).query('SELECT TOP 1 Id FROM Bookings WHERE ServiceId = @id');
    if(bookingCheck.recordset.length > 0){
        throw new Error('Usluga ima rezervacije i ne moze biti obrisana');
    }

    const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM Services WHERE Id = @id');

    if(result.rowsAffected[0] === 0){
        throw new Error('Usluga ne postoji');
    }

}