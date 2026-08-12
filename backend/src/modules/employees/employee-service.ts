import { CreateEmployeeInput, UpdateEmployeeInput, EmployeeResponse } from "../../types/employee-types";
import { getPool } from "../../config/database";
import sql from 'mssql';

//moramo vratiti zaposlene SA NJIHOVIM USLUGAMA
//employees tabela nema usluge za zaposlene
export async function getEmployees(): Promise<EmployeeResponse[]>{

    //dohvatimo zaposlenog
    //pravimo prazan niz za zaposlenog sa uslugama
    //prolazimo kroz sve zaposlene
    //trazimo usluge iz baze za svakog zaposlenog
    //stavljamo objekat u gore inicijalizovan prazan niz

    const pool = await getPool();
    const result = await pool.request().query('SELECT Id, Name, Email FROM Employees ORDER BY NAME');

    const employees = result.recordset;
    const employeesWithServices: EmployeeResponse[] = []; 

    //trazimo zaposlenog iz tabele EmployeeServices na osnovu proslijedjenog emplId i onda innerjoin sa service tabelom
    for(const employee of employees){
       const serviceResult = await pool.request().input('employeesId', sql.Int, employee.Id).query(`SELECT s.Id, s.Name FROM SERVICES S INNER JOIN EmployeeServices es ON s.Id = es.ServiceId WHERE es.EmployeeId = @employeeId`);

       //selektujemo id i name servisa(usluge) iz tabele services -> ovo ide na kraju
       //1. spajamo tabelu services sa employeeservices da bismo iz tabele employeeservices dosli do tabele services preko zajednickog parametra, a to je id 
       //2. ON -> spajamo ih preko id s.Id = es.ServiceId (ServiceId -> tako se zove id u tabeli EmployeeServices)
       //3. WHERE es.EmployeeId = @employeeId -> od svih dobijenih redova iz  prethodnog dijela upita, izdvajamo samo one koji se poklapaju sa id-jem koji je gore proslijedjen kroz input dio


       employeesWithServices.push({
        id: employee.Id,
        name: employee.Name,
        email: employee.Email,
        services: serviceResult.recordset.map((s) => ({id: s.Id, name: s.Name}))
       });
    }
    return employeesWithServices;
}

export async function createEmployee(input: CreateEmployeeInput): Promise<EmployeeResponse>{

    const pool = await getPool();
    const result = await pool.request().input('name', sql.NVarChar, input.name).input('email', sql.NVarChar, input.email).query('INSERT INTO Employees (Name, Email) OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.Email VALUES (@name, @email)');

    const newEmployee = result.recordset[0];

    //ubacujemo novog zaposlenog i u tabelu EmployeeServices
    for(const serviceId of input.serviceIds){
        await pool.request().input('employeeId', sql.Int, newEmployee.Id).input('serviceId', sql.Int, serviceId).query(`INSERT INTO EmployeeServices (EmployeeId, ServiceId) VALUES (@employeeId, @serviceId)`);
    }

    //kad je zaposleni i u tabeli EmployeeServices, onda mozemo da radimo innerjoin sa tabelom Services da dohvatimo usluge zaposlenog 
    const serviceResult = await pool.request().input('employeeId', sql.Int, newEmployee.Id).query(` SELECT s.   Id, s.Name
      FROM Services s
      INNER JOIN EmployeeServices es ON s.Id = es.ServiceId
      WHERE es.EmployeeId = @employeeId`);

     return {
        id: newEmployee.Id,
        name: newEmployee.Name,
        email: newEmployee.Email,
        services: serviceResult.recordset.map((s) => ({ id: s.Id, name: s.Name })),
  };
}

export async function deleteEmployee(id: number): Promise<void>{
    const pool = await getPool();
    const result = await pool.request().input('id', sql.Int, id).query('DELETE FROM Employees WHERE Id = @id');
    if(result.rowsAffected[0] === 0){
        throw new Error('Zaposleni ne postoji');
    }
}