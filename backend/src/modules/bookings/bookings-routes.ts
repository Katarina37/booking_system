import { Router } from "express";
import { getAvailableSlotsController, createBookingController, getBookingsForClientController, getAllBookingsController, deleteBookingController } from "./bookings-controller";
import { requireAuth, requireAdmin } from "../auth/auth-middleware";

//ne treba new Router
const bookingRouter = Router();

bookingRouter.get('/available-slots', requireAuth, getAvailableSlotsController);
bookingRouter.post('/', requireAuth, createBookingController);
bookingRouter.get('/my-bookings', requireAuth, getBookingsForClientController);
bookingRouter.get('/', requireAuth, requireAdmin, getAllBookingsController);
bookingRouter.delete('/:id', requireAuth, deleteBookingController);

export default bookingRouter;