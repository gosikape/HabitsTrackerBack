import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {
}

export class NotFoundError extends Error {
}

export class NotAuthorizedError extends Error {
}

export const handleError = (err: Error, req: Request, res: Response, next: NextFunction): void => {

    if (err instanceof NotFoundError) {
        res
            .status(404)
            .json({
                message: err.message ?? 'Given ID could not be found.',
            });
        return;
    }

    if (err instanceof NotAuthorizedError) {
        res
            .status(401)
            .json({
                message: err.message ?? `You are not authorized to view this resource`,
            });
        return;
    }


    res
        .status(err instanceof ValidationError ? 400 : 500)
        .json({
            message: err instanceof ValidationError ? err.message : 'Sorry, please try again later.',
        });

    console.error(err);
};

