import { Router } from "express";
import { getServicesController, createServiceController, updateServiceController, deleteServiceController } from "./services-controller";
import { requireAuth, requireAdmin } from "../auth/auth-middleware";

const serviceRouter = Router();

serviceRouter.post('/', getServicesController);
serviceRouter.post('/', requireAuth, requireAdmin, createServiceController);
serviceRouter.post('/:id', requireAuth, requireAdmin, updateServiceController);
serviceRouter.post('/:id', requireAuth, requireAdmin, deleteServiceController);

export default serviceRouter;