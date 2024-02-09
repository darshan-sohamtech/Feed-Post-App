const { signupUser, loginUser } = require('../controller/auth-controller');

const router = require('express').Router();


//---------GET Route------------
router.get('/login', (req, res) => {
    return res.render('login',{
        message: req.flash('message')
    });
})

router.get('/signup', (req, res) => {
    return res.render('signup',{
        message: req.flash('message')
    });
})


//---------POST Route------------
router.post('/login', loginUser);

router.post('/signup', signupUser);

module.exports = router;