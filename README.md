# [reserve-api](https://github.com/FergusHongJiangZhou/reserve-api.git)

Backend API for Reserve(Graphql, Typescript, MongoDB)

## Start

Add file `.env` with below:

```
MONGODB_URL=mongodb://docker:mongopw@localhost:55000/test?authSource=admin
SECRET_KEY=test
```

run

```
$ npm i
$ npm start
```

View API Details in http://localhost:4000/graphql

## Test

```
$ npm run test
```
