import Router from 'express';

export const logoutRouter = Router();

logoutRouter

    .get('/', async (req, res, next) => {
        try {
            req.logOut(req.user, function (err) {
                //console.log(`logout cb called`)
                if (err) {
                    console.log(err);
                    return next(err);
                }
            })
        } catch (e) {
            console.log(e);
        }
        res.clearCookie("connect.sid");

        // console.log(`Logout called`,req.user,req.session, req.isAuthenticated())

        return res.status(200).json({
            user: req.user,
            isAuth: req.isAuthenticated(),
        });
    });

