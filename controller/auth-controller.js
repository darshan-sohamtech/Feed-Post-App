const User = require('../model/user');
const Post = require('../model/post');


const signupUser = async (req, res) => {
    try {
        const { email  } = req.body;
        let existingUser = await User.findOne({ email: email });
        if (existingUser) {
            req.flash('message', 'User Existing .');
            return res.redirect('/auth/signup');
        } else {
            const user = new User(req.body);
            await user.save();
            req.flash('message', 'User Added successfull...');
            return res.redirect('/auth/login');
        }
    } catch (error) {
        console.log(error);
        return res.render('./error/500-page');
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const posts = await Post.find({}).populate("createdBy");
        const userDetail = await User.findOne({ email: email });
        
        if (!userDetail) {
            req.flash('message', 'Invalid Email or Password! Please Try Again.');
            return res.redirect('/auth/login');
        } else {
            try {
                const token = await User.matchPasswordAndGenerateToken(email, password);                
                if (userDetail.isAdmin === true) {
                    req.flash('message', 'Loggin SuccessFully');
                    return res.cookie('token', token ,{expires: new Date(Date.now() + 3600000)} ).render('./admin/admin', {
                        user: req.user,
                        posts,
                        userData: userDetail,
                        message: req.flash('message')
                        
                    })
                } else {
                    req.flash('message', 'Loggin SuccessFully');
                    return res.cookie('token', token,{expires: new Date(Date.now() + 3600000)}).render('./user/dashboard', {
                        user: req.user,
                        posts,
                        userData: userDetail,
                        message: req.flash('message')
                    })
                }
            } catch (error) {
                req.flash('message', 'Invalid Email or Password! Please Try Again.');
                return res.redirect('/auth/login');
                console.log(error);
            }
        }

    } catch (error) {
        return res.render('./error/500-page');
    }
}


module.exports = {signupUser , loginUser}