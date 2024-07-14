const router = require('express').Router();
const bcrypt= require('bcryptjs');
const DB_user = require('../../DB-codes/users/DB-user-api');
const {verify} = require('../../middlewares/user-verification');



router.get('/adminsearch', verify, async (req, res) => {
    const users = await DB_user.getUsersForadmin(req.query);
    res.render('adminviews.ejs', {
                title : 'Admin Users',
                body: ['users/adminhome'],
                users: users,
                cur_user_id: req.user.USER_ID
            });
 });
 

router.get('/:user_id', verify, async (req, res) => {
    const cur_user_id = req.user.USER_ID;
    const user = await DB_user.getUserByIdforadmin(req.params.user_id);
    res.render('layout.ejs', {
                title : 'Admin Profile',
                body: ['users/adminhome'],
                user: user,
                cur_user_id: cur_user_id
            });
});

router.get('/get', verify, async (req, res) => {
    const user = await DB_user.getUsercount();
    res.render('adminviews.ejs', {
                title : 'Usercount',
                body: ['users/adminhome'],
                user: user,
                cur_user_id: cur_user_id
            });
});

router.get('', verify, async (req, res) => {
    const user = await DB_user.getUserByIdforadmin(req.user.USER_ID);
    res.render('adminviews.ejs', {
                title : 'Admin Profile',
                body: ['users/admin'],
                user: user,
                cur_user_id: user.USER_ID
            });
});
module.exports = router;