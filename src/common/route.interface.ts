import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from './middleware.interface';

export interface IControllerRoute {
	path: string;
	function: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'patch' | 'put' | 'post' | 'delete'>;
	middlewares?: IMiddleware[];
}
