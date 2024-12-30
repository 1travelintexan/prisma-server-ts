declare namespace Express {
  interface Request {
    payload?: {
      name: string;
      id: string;
    };
  }
}
