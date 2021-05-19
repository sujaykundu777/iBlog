# iBlog

Webapp built using Nodejs, Express, EJS, Bootstrap and Mongodb

## Features :

- Authentication using - Local, Google, Facebook

### Public
- /           Home
- /login      Login
- /register   Register
- /goo        Google Login
- /fb         Facebook Login
- /dashboard  User Dashboard

## How to run :

You need Node v15, Mongodb installed

### Clone locally

`git clone https://github.com/sujaykundu777/iBlog.git`
`cd iBlog`

### Install packages:

`npm install`

### updating environment variables

clone the .env.example file in to .env file, change the credentials with your own.

### Start mongodb server at port: 27017

### Run the app in development (supports auto-watch for changes)

`npm run dev`

should start the app at `http://localhost:3000`

### Run the app in production

`npm run start`

should start the app at `http://localhost:3000`

## APIDOCs - Swagger generated docs using OpenApi Specification

You can visit `http://localhost:3000/apidoc` for apidoc using swagger locally

or visit [Swagger Editor](http://editor.swagger.io/#/) and upload `swagger.json` file to view the docs

