import { Router } from "express";
import { getServicesController, createServiceController, updateServiceController, deleteServiceController } from "./services-controller";
import { requireAuth, requireAdmin } from "../auth/auth-middleware";

const serviceRouter = Router();

//treba get a ne post
serviceRouter.get('/', getServicesController);
serviceRouter.post('/', requireAuth, requireAdmin, createServiceController);
serviceRouter.post('/:id', requireAuth, requireAdmin, updateServiceController);
serviceRouter.delete('/:id', requireAuth, requireAdmin, deleteServiceController);

export default serviceRouter;