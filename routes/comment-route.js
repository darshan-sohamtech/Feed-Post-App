const router = require('express').Router();
const { addComment, deleteCommentById, addCommentReplay, deleteReply } = require('../controller/comment-controller');
const verifyToken = require('../middlewares/token-verify');


//GET route

router.get("/delete/:id",verifyToken, deleteCommentById);

router.get("/delete/reply/:id", verifyToken, deleteReply);

//POST route
router.post("/:id",verifyToken, addComment);

router.post("/reply/:cId", verifyToken, addCommentReplay);

module.exports = router;
