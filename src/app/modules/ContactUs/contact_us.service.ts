import { Contact_Us } from './contact_us.model';
import { IContact } from './contact_us.interface';

// contact us
const addContactUsDataToDB = async (payload: IContact) => {
  const newContact = new Contact_Us(payload);
  await newContact.save();
};

// update contact us status
const updateContactUsStatus = async (id: string, is_contacted: boolean) => {
  await Contact_Us.findByIdAndUpdate(id, { is_contacted });
};

export const ContactUsServices = {
  addContactUsDataToDB,
  updateContactUsStatus,
};
