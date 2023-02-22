const router = require("express").Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../../models/User");
// mongoose.set('strictQuery', false);
// validate of user inputs

const Joi = require("@hapi/joi");

const registerSchema  = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(6).required()
})

router.post("/register", async (req, res) => {
    // check if email is there 
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist){
        res.status(400).send("Email already exists");
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // adding on new user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        // check of user inputs  
        const { error } = await registerSchema.validateAsync(req.body);
        // if error exist with object deconstruction
        // if error exits then return error 
        if(error){
            res.status(400).send(error.details[0].message);
            return;
        }else{
            const saveUser = await user.save();
            res.status(500).send("user created")
        }
    }
    catch(error){
        res.status(500).send(error)
    }
});
const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password:Joi.string().min(6).required(),
})

router.post("/login", async(req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send("Incorrect Email-Id");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send("Incorrect password");

    try{
        const { error } = await loginSchema.validateAsync(req.body);
        if(error) return res.status(400).send(error.details[0].message);
        else{
            const token = jwt.sign({_id:user,_id},process.env.TOKEN_SECRET);
            res.header("auth-token",token),send(token)
        }
    }catch(error){
        res.status(500).send(error);
    }
});

module.exports = router;