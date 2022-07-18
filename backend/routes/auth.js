const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { signupValidation, loginValidation } = require('../validation');

//Signup
router.post('/signup', async (req, res) => {

    const { error } = signupValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check for Email
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    //Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Create new User
    const user = new User({
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send({ message: "inscription réussie"});
    } catch (err) {
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req, res, next) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check for Email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email is not found');

    // Right Password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Invalid password')

    //Create-Assign token
    const token = jwt.sign({ _id: user._id }, process.env.RANDOM_TOKEN_SECRET)
    res.send({userId: user._id, token: token});
    next;
});


module.exports = router;
