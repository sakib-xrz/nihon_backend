export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  is_contacted: boolean;
  createdAt: Date;
}
