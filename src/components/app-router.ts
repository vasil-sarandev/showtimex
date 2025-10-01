import { Router } from 'express';
import { userRouter } from './user/user.router';
import { paymentRouter } from './payment/payment.router';
import { eventRouter } from './event/event.router';
import { venueRouter } from './venue/venue.router';
import { ticketRouter } from './ticket/ticket.router';
import { performerRouter } from './performer/performer.router';

export const appRouter = Router();

appRouter.use('/user', userRouter);
appRouter.use('/payment', paymentRouter);
appRouter.use('/event', eventRouter);
appRouter.use('/venue', venueRouter);
appRouter.use('/ticket', ticketRouter);
appRouter.use('/performer', performerRouter);
