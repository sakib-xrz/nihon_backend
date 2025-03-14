/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import { setValue, unsetValue } from 'node-global-storage';
import config from '../config';

const bkashAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Clear existing id_token from global storage
    unsetValue('id_token');

    // Make request to obtain id_token
    const { data } = await axios.post(
      config.bkash.grant_token_url as string,
      {
        app_key: config.bkash.api_key,
        app_secret: config.bkash.secret_key,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          username: config.bkash.username,
          password: config.bkash.password,
        },
      },
    );

    setValue(`id_token`, data?.id_token, { protected: true });

    next();
  } catch (error: any) {
    // Handle authentication error
    res.status(401).json({
      error: error?.message || 'Unauthorized',
    });
  }
};

export default bkashAuth;
