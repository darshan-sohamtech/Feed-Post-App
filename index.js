require('dotenv').config();
//import external modules
const express = require('express');
const app = express();
const path = require('path');
const cookiePaser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');

//import extrenal route
const db = require('./config/db-config');
const { checkForAuthenticationCookie, } = require("./middlewares/authentication");
const Post = require('./model/post');
const Comment = require('./model/comment');
const Reply = require('./model/reply');
const PORT = process.env.PORT || 8000;
const authRoute = require('./routes/auth-route');
const postRoute = require('./routes/post-route');
const commentRoute = require('./routes/comment-route');



//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }

}))
app.use(flash());

app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/css', express.static(path.join(__dirname, "../node_modules/jquery/dist")));

//Routes
app.get('/', (req, res) => {
    return res.clearCookie('token').render('home');
})
app.get('/dashboard', async (req, res) => {
    try {
        const posts = await Post.find({isDelete:false}).populate("createdBy");
        return res.render('./dashboard',{posts});
    } catch (error) {
        return res.json({
            message:"Internal Server Error..."
        });
    }
})
app.get('/logout',async(req, res) => {
    try {
        res.clearCookie();
        const posts = await Post.find({isDelete:false}).populate("createdBy");
        return res.render('./login', {
            posts,
            message:req.flash('message')
        });
    } catch (error) {
        return res.json({
            message:"Internal Server Error..."
        });
    }
})
app.get('/dashboard',async (req, res) => {
    const posts = await Post.find({isDelete:false}).populate("createdBy");
    return res.render('./dashboard', {
        posts
    });
})
app.get('/p/:id',async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById({ _id: postId }).populate("createdBy");
        const comments = await Comment.find({$and:[{ postOn: postId },{isDelete:false}]}).populate("createdBy");
        const replys = await Reply.find({isDelete:false}).populate("createdBy");
        if (!post) {
            res.render('./error/404-page');
        }
        return res.render('./get-post-by-id', {
            post,
            comments,
            replys
        })
    } catch (error) {
        return res.json({
            message : "Internal Server Error..."
        })
    }
});


//External-Route
app.use('/auth', authRoute,(req, res, next) => {
    if (res.status(404)) {  
        res.render('./error/404-page');
    }
});
app.use('/post', postRoute,(req, res, next) => {
    if (res.status(404)) {  
        res.render('./error/404-page');
    }

  });
app.use('/comment', commentRoute,(req, res, next) => {
    if (res.status(404)) {  
        res.render('./error/404-page');
    }

  });

//Error Page Route
app.use((req, res, next) => {
    if (res.status(404)) {  
        res.render('./error/404-page');
    }

  });
//Database Connection And  Server Create
db.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})