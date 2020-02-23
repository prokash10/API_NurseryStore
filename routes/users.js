const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const jwtSecret = "Ashish";
const auth = require('../auth');
const router = express.Router();

//get all users in admin panel.
router.get('/', (req,res)=>{
    User.find({})
    .then((userlists)=>{
        res.send(userlists);
    }).catch((err)=>{
        res.send('Error', err.message)
    })
});

//For User SignUp
router.post('/signup', (req,res, next) => {
    User.find({Email: req.body.Email}) //Check if email id exists
    .exec()
    .then(user => {
        if (user.length >=1) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }
        else{
            let Password = req.body.Password
            bcrypt.hash(Password, 10, function(err,hash){
            if(err){
                let err = new Error('Could not hash!')
            err.status = 500
            return next(err)
            }
            User.create({
                FullName: req.body.FullName,
                UserName: req.body.UserName,
                Email: req.body.Email,
                PhoneNo: req.body.PhoneNo,
                Password: hash
            }).then(()=>{
                let token = jwt.sign({ _id: user._id }, jwtSecret)
                res.json({ status: "Signup success!", token: token});
            }).catch(next);
        })
        }      
    })
})

router.post('/login', (req, res, next) => {
    User.findOne({ Email: req.body.Email })
        .then((user) => {
            if (user == null) {
                let err = new Error('User not found!');
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.Password, user.Password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('Password does not match!');
                            err.status = 401;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, jwtSecret);
                        let id = user._id;
                        res.json({ id, status: 'Login success!', token: token });
                    }).catch(next);
            }
        }).catch(next);
})

router.delete('/:id', function(req, res){
    User.findByIdAndDelete(req.params.id).then(function(){
        res.send("deleted")
    }).catch(function(){ 
        res.send(e)
    })
    })

router.get('/search/:UserName', async (req, res) => {
    const searchName = req.params.UserName;
    console.log(searchName);
    try {
        const search = await User.find({$text:{$search:searchName}})
        res.send(search);
    } catch (error) {
        res.status(400).send(error)
    }

});

router.get('/me', auth.verifyUser, (req, res, next) => {
    res.json({ _id: req.user._id, FullName: req.user.FullName,
         UserName: req.user.UserName, Email: req.user.Email, PhoneNo: req.user.PhoneNo });
});

router.put('/me', auth.verifyUser, (req, res, next) => {
    User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true })
        .then((user) => {
            res.json({ _id: user._id, FullName: req.user.FullName,
                 UserName: req.user.UserName, Email: user.Email, PhoneNo: user.PhoneNo });
        }).catch(next);
});

module.exports = router;