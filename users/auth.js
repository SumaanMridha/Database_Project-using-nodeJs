require('dotenv').config();
const router = require('express').Router();
 const DB_user = require('../../DB-codes/users/DB-user-api');
 const bcrypt= require('bcryptjs');
 const jwt = require('jsonwebtoken');
 const {verify} = require('../../middlewares/user-verification');
 const { errors } = require('joi/lib');

router.get('/register', (req, res) => {
    res.render('body/auth/register.ejs', {
            title : 'skillVerse Register',
                //body : ['auth/register'],
                user : null,
                errors : errors
        })
});

router.post('/register', async (req, res) => {
    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    //insert user
    let result, errors = [];
    result = await DB_user.insertUser(req.body, hashedPassword);
    if (result.result == 'Email already exists' || result.result == 'Please enter the fields correctly') {
        errors.push(result.result);
        res.render('body/auth/register.ejs', {
                title : 'skillverse Register',
                user : null,
                errors : errors,
                form : {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    department: req.body.department,
                    batch: req.body.department,
                    gender: req.body.gender,
                    city: req.body.city,
                    country: req.body.country,
                    email: req.body.email,
                    password: req.body.password
                }
            });
    } else {
        res.redirect('/api/auth/login?register=Registration is Successful');
    }
    
});

router.get('/login', (req, res) => {
    let errors = [];
    if (req.query.register)
        errors.push(req.query.register);
    res.render('body/auth/login.ejs', {
            title : 'skillVerse Login',
            //body: ['auth/login'],
            user: null,
            errors: errors
        })
});

router.post('/login', async (req, res) => {
    
    let result = [], errors = [];
    result = await DB_user.getUserByEmail(req.body.email);
    
    // if no result, there is no such user
    if (result === undefined) {
        errors.push('Wrong Email');
    } else {
        // match passwords
        const validPass = await bcrypt.compare(req.body.password, result.PASSWORD);
        if (validPass) {
            // if successful login the user
            const token = jwt.sign({ user_id: result.USER_ID }, process.env.JWT_TOKEN_HELPER);
            let options = {
                maxAge: 90000000, 
                httpOnly: true
            }
            res.cookie('auth-token', token, options);
        }
        else {
            errors.push('Wrong Password');
        }
    }
    if(errors.length == 0){
        
        if(result.LAST_NAME =="ADMIN")
        {
            res.redirect('/api/user');
        }
        else
        {
            res.redirect('/api/user');
        }
       
    } else {
        res.render('body/auth/login.ejs', {
            title : 'skillVerse Login',
            //body: ['auth/login'],
            user: null,
            errors : errors,
            form: {
                email: req.body.email,
                password: req.body.password
            }
        });
    }
    
});

router.post('/logout',(req,res)=>{
    //destroy token
    res.cookie('auth-token', '', { maxAge:1 });
    res.redirect('/api/auth/login');
});

router.get('/user_id', (req,res)=>{
    //returns the id of logged in user
    res.send({user_id : req.user.USER_ID});
});
//------------------------------------------------------------------------------------------------

router.get('/loginasadmin', (req, res) => {
    let errors = [];
    if (req.query.register)
        errors.push(req.query.register);
    res.render('body/auth/loginasadmin.ejs', {
            title : 'skillVerse Admin Login',
            //body: ['auth/login'],
            user: null,
            errors: errors
        })
        console.log(req.body);

});

router.post('/loginasadmin', async (req, res) => {
    let result = [], errors = [];
    result = await DB_user.getUserByEmail(req.body.email);
    
    // if no result, there is no such user
    if (result === undefined) {
        errors.push('Wrong Email');
    } else {
        // match passwords
        const validPass = await bcrypt.compare(req.body.password, result.PASSWORD);
        if (validPass) {
            // if successful login the user
            const token = jwt.sign({ user_id: result.USER_ID }, process.env.JWT_TOKEN_HELPER);
            let options = {
                maxAge: 90000000, 
                httpOnly: true
            }
            res.cookie('auth-token', token, options);
        }
        else {
            errors.push('Wrong Password');
        }
    }
    if(errors.length == 0){
        
        if(result.LAST_NAME =="ADMIN")
        {
            res.redirect('/api/admin');
        }
       
    } else {
        res.render('body/auth/loginasadmin.ejs', {
            title : 'skillVerse Admin Login',
            //body: ['auth/login'],
            user: null,
            errors : errors,
            form: {
                email: req.body.email,
                password: req.body.password
            }
        });
    }
    
});


//------------------------------------------------------------------------------------------------












module.exports = router;