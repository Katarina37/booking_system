import { Router } from "express";
import { getEmployeesController, createEmployeeController, deleteEmployeeController } from "./employee-controller";
import { requireAdmin, requireAuth } from "../auth/auth-middleware";

const employeeRouter = Router();

employeeRouter.post('/', getEmployeesController);
employeeRouter.post('/', requireAuth, requireAdmin, createEmployeeController);
employeeRouter.post('/:id', requireAuth, requireAdmin, deleteEmployeeController);

export default employeeRouter;

