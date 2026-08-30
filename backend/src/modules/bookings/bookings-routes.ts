import { Router } from "express";
import { getAvailableSlotsController, createBookingController } from "./bookings-controller";
import { requireAuth } from "../auth/auth-middleware";

//ne treba new Router
const bookingRouter = Router();

bookingRouter.get('/available-slots', requireAuth, getAvailableSlotsController);
bookingRouter.post('/', requireAuth, createBookingController);

export default bookingRouter;