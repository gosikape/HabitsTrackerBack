# Habit Tracker App (BE)


## Description

This is basic habit tracking app for users to track their daily habits. lt is build with NodeJS, TS, MySQL and PassportJS. 

## Folder Structure

```
habit-tracking-backend-app
├── dist/
├── nodemodules/
├── records/
│ └── habit.record.ts
│ └── password.record.ts
│ └──user.record.ts
├── routers/
│ └── habit.router.ts
│ └──home.router.ts
│ └──login.router.ts
│ └──logout.router.ts
│ └──register.router.ts
│ └──user.router.ts
├── types/
│ └── habit/
│ │ └──habit.ts
│ │ └──habit-entity.ts
│ │ └──index.ts
│ └──login/
│ │ └──index.ts
│ │ └──login-entity.ts
│ └──password
│ │ └──index.ts
│ │ └──password.ts
│ │ └──password-entity.ts
│ └──register
│ │ └──index.ts
register-entity.ts
│ └──user
│ │ └──index.ts
│ │ └──user.ts
│ │ └──user-entity.ts
│ │ └──index.ts
├── utils/
│ └── authMiddleware.ts
│ └──db.ts
│ └──errorHandler.ts
│ └──passport.ts
│ └──session.tsindex.ejs
├── .gitignore
├── index.ts
├── package.json
├── package-lock.json
├──README.md
├──tsconfig.json
```

## Features

* create an account using email and password
* log in and authenticate user with the passport-local strategy
* add, remove and edit (e.g. ractivate) habits
* filter out only active habits
* mark finished reps and change the habit status from ‘in progress’ to ‘completed’ when they are done
* brief summary of all time performance (number of added versus completed habits and completetion rate)
* store habit data in a database.


