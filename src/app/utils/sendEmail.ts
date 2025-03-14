import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'kevon.legros42@ethereal.email',
      pass: '2mBv11ppat3aQ6jseX',
    },
  });

  await transporter.sendMail({
    from: 'mezbaul@programming-hero.com', // sender address
    to,
    subject: 'Reset your password within ten mins!', // Subject line
    text: '',
    html,
  });
};
