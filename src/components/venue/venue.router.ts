import express from 'express';

export const venueRouter = express.Router();

venueRouter.post('/');
venueRouter.get(':id');
