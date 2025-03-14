import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { Subscriber } from './subscribe.model';

// subscribe to news letter notifications
const subscribeToNewsLetter = async (email: string) => {
  // find the email if it is already subscribed
  const isEmailExistsInSubscribeDB = await Subscriber.findOne({ email });

  if (isEmailExistsInSubscribeDB) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already subscribed');
  }

  // create a new subscriber record
  const newSubscriber = new Subscriber({ email });
  await newSubscriber.save();
};

export const SubscribeServices = { subscribeToNewsLetter };
