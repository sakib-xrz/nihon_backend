import express from 'express';
import { ContactUsControllers } from './contact_us.controller';
import validateRequest from '../../middlewares/validateRequest';
import { ContactUsValidation } from './contact_us.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

// contact us
router.post(
  '/contact_us',
  validateRequest(ContactUsValidation.contactUsValidationSchema),
  ContactUsControllers.addContactUsDataToDB,
);

// update contact us status
router.put(
  '/update_contact_us_status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.moderator),
  ContactUsControllers.updateContactUsStatus,
);

export const ContactUsRoutes = router;
