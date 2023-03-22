const express = require('express'); 
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const cookieSession = require("cookie-session");
const passport = require("passport");

dotenv.config();
const PORT = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json());

app.use(
    cookieSession({
      name:"session",
      keys:["brownmundes"],
      maxAge: 24 * 60 * 60 * 100,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

const db = require('./db')
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const appRouter = require('./routes/app-routes');
app.use('/', appRouter);



app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));