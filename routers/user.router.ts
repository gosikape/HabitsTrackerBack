import Router from 'express';
import {UserRecord} from "../records/user.record";
import {isAuth} from "../utils/authMiddleware";

export const userRouter = Router();

userRouter

    .get('/', isAuth, async (req, res) => {
        const usersList = await UserRecord.listAll();

        res.json({
            usersList,
        });
    });


