import express from 'express';
import { SubscribeControllers } from './subscribe.controller';
import validateRequest from '../../middlewares/validateRequest';
import { SubscriberValidation } from './subscribe.validation';

const router = express.Router();

// subscribe to news letter notifications
router.post(
  '/subscribe_to_news-letter/:email',
  validateRequest(SubscriberValidation.subscriberValidationSchema),
  SubscribeControllers.subscribeToNewsLetter,
);

export const SubscribeRoutes = router;
