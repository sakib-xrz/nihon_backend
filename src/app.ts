import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://nihonbeautyfrontend.vercel.app',
    ],
    credentials: true,
  }),
);

// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Nihon Beauty - Server is running!');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
