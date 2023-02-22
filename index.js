const express = require('express')
const app = express();
const PORT = process.env.PORT || 4050

app.get("/", (req, res) => {
    res.send(`Hey it's working !!`);
});
app.listen(PORT, () => console.log(`server up and running at ${PORT}`))

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
// importing router 
const authRoutes = require('./routes/auth/auth')
// accessing the env var
dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    {useNewUrlParser: true, useUnifiedTopology:true},
    () => console.log("connected to db ")
);

// middleware -> disable cor and used json o/p
app.use(express.json(), cors())

// route middleware 
app.use("/api/users", authRoutes)
