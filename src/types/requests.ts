import { Request } from "express";
//type interface for req.body
export interface RequestSignup extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
export interface RequestLogin extends Request {
  body: {
    email: string;
    password: string;
  };
}
export interface RequestWithToken extends Request {
  payload: {
    id: string;
    name: string;
  };
}
