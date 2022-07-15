// Requiring module
const express = require('express');
const mysql = require("mysql");
const cors = require("cors");
const mongoose = require("mongoose");

// Creating express object
const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect('mongodb://localhost:27017/blockvote', () => {
    console.log("DB connected")
});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

//model
const User = new mongoose.model("User", userSchema)//userSchema type cha user banvaycha ahe he samjel


//Routes
app.post("/login", (req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }, (err, user) => {
        if (user) {//if user registerd with email that enterd by user then then check password
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user })//send user data with msg to display user data in front end
            }
            else {
                res.send({ message: "Password didn't match" })
            }
        }
        else {
            res.send({ message: "User not registered" })
        }
    })
})

app.post("/register", (req, res) => {
    const { name, email, password } = req.body

    //first we check if user is already in database or not by find one 
    User.findOne({ email: email }, (err, user) => {
        if (user) {//if user found in database
            res.send({ message: "User already registerd" })
        }
        else {
            const user = new User({//input values assign to user schema object
                name: name,
                email: email,
                password: password
            })
            user.save(err => {//save function store user in database
                if (err) {
                    req.send(err)//if error then return error
                }
                else {
                    res.send({ message: "Successfully Registered" })//othervise send mesg object
                }
            })
        }
    })
})

app.listen(9002, () => {
    console.log("BE started at port 9002")
})


























// const db = mysql.createConnection({
//     user: "root",
//     host: "localhost",
//     password: "root",
//     database: "blockvote",
// });

// app.post('/register', (req, res) => {
//     const name = req.body.name;
//     const email = req.body.email;
//     const password = req.body.password;

//     db.query("INSERT INTO registration (username, email, password) VALUES (?,?,?)",
//         [name, email, password],
//         (err, result) => {
//             console.log(err);
//         })
//     // console.log(req.body);
// })


// app.post('/login', (req, res) => {
//     const email = req.body.email;
//     const password = req.body.password;

//     db.query("SELECT * FROM registration WHERE email = ? AND password = ?",
//         [email, password],
//         (err, result) => {
//             if (err) {
//                 res.send({ err: err })//sending error as an object to front end
//             }
//             else {
//                 if (result.length > 0) {//if we have atleast one record with input email pass
//                     res.send({ message: "Login successfull", result });//if all correct then send result to frontend
//                 }
//                 else {
//                     res.send({ message: "Wrong Email/password combination" })
//                 }
//             }

//         })
// })

// app.listen(3001, () => {
//     console.log("running server");
// })




// // Handling GET request
// app.get('/', (req, res) => {
//     res.send('A simple Node App is '
//         + 'running on this server')
//     res.end()
// })

// // Port Number
// const PORT = process.env.PORT || 5000;

// // Server Setup
// app.listen(PORT, console.log(
//     `Server started on port ${PORT}`));