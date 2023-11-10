import Router from 'express';
import {SetHabitUpdateReq} from '../types';
import {HabitRecord} from "../records/habit.record";
import {UserRecord} from "../records/user.record";
import {isAuth} from "../utils/authMiddleware";
import {NotFoundError, ValidationError} from "../utils/errorHandler";

export const habitRouter = Router();

habitRouter

    .get('/', isAuth, async (req, res) => {
        //console.log(`getHabit`,isAuth, req.user);
        const user = req.user as UserRecord;
        const habitsListForUser = await HabitRecord.listAllForUser(user.id);
        res.json({
            habitsListForUser,
        });
    })

    .get('/:id', isAuth, async (req, res) => {
        const habitUnit = await HabitRecord.getOne(req.params.id)

        if (!habitUnit) {
            throw new NotFoundError('Habit with given ID could not be found');
        }

        res.json({
            habitUnit
        })
    })

    .post('/', isAuth, async (req, res) => {
        const user = req.user as UserRecord;
        const newHabit = new HabitRecord(req.body);

        if (newHabit.title.length < 3 || newHabit.title.length > 150) {
            throw new ValidationError('Title must have at least 3 and at most 150 characters');
        }

        await newHabit.insert(user.id);

        res.json(newHabit);
    })

    .delete('/:id', isAuth, async (req, res) => {
        const habit = await HabitRecord.getOne(req.params.id);

        if (!habit) {
            res.status(404);
            throw new NotFoundError('Habit with given ID could not be found');
        }

        await habit.delete();
        res.end();
    })

    .patch('/:id', isAuth, async (req, res) => {
        const habit = await HabitRecord.getOne(req.params.id);

        if (habit === null) {
            throw new NotFoundError('Habit with given ID could not be found');
        }
        const {title, description, userRepeatCount, totalRepeatCount, isActive} = req.body as SetHabitUpdateReq;

        habit.title = title ?? habit.title;
        habit.description = description ?? habit.description;
        habit.totalRepeatCount = totalRepeatCount ?? habit.totalRepeatCount;
        habit.userRepeatCount = userRepeatCount ?? habit.userRepeatCount;
        habit.isActive = req.body.isActive == 0 ? false : true;


        if (habit) {
            if (habit.title.length < 3 || habit.title.length > 150) {
                throw new ValidationError('Title must have at least 3 and at most 150 characters');
            }
            if (habit.description.length > 1000) {
                throw new ValidationError('Description must have and at most 1000 characters');
            }
            if (habit.userRepeatCount > habit.totalRepeatCount) {
                throw new ValidationError(`Total number of habit's reps cannot be smaller than finished reps number`);
            }
            if (habit.totalRepeatCount === 0) {
                throw new ValidationError(`Total number of reps must be greater than 0`)
            }
        }

        await habit.update();

        res.json(habit);
    });
