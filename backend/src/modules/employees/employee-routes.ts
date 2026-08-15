import { Router } from "express";
import { getEmployeesController, createEmployeeController, deleteEmployeeController } from "./employee-controller";
import { requireAdmin, requireAuth } from "../auth/auth-middleware";

const employeeRouter = Router();

employeeRouter.get('/', getEmployeesController);
employeeRouter.post('/', requireAuth, requireAdmin, createEmployeeController);
employeeRouter.delete('/:id', requireAuth, requireAdmin, deleteEmployeeController);

export default employeeRouter;

