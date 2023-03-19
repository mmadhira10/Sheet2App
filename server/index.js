const express = require('express'); 
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))
app.use(express.json());





app.listen(80, () => console.log('Listening on Port 80'));