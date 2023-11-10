import {NextFunction, Request, Response} from "express";

export const isAuth = async (req: Request, res: Response, next: NextFunction) => {
    //console.log(`isAuthenticatedMW`,req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.status(401).json({message: `You are not authorized to view this resource`});
    }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {

};
