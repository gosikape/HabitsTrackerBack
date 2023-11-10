//import 'dotenv/config';
import express, {json} from 'express';
import cors from 'cors';
import 'express-async-errors';
import {handleError} from "./utils/errorHandler";
import rateLimit from 'express-rate-limit';
import session from "express-session";
import {sessionStore} from "./utils/session";
import './utils/passport';
import passport from "passport";

import {homeRouter} from "./routers/home.router";
import {loginRouter} from "./routers/login.router";
import {registerRouter} from "./routers/register.router";
import {habitRouter} from "./routers/habit.router";
import {userRouter} from "./routers/user.router";
import {logoutRouter} from "./routers/logout.router";

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(json());
app.use(rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
}));

app.use(session({
    secret: 'session_cookie_secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/habit', habitRouter);
app.use('/user', userRouter);
app.use('/logout', logoutRouter);

app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on port: http://localhost:3001');
});

