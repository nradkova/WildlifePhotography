const router = require('express').Router();

const preloadOne = require('../middlewares/preload');
const { editUser } = require('../services/userService');
const formatErrorMsg = require('../util/formatErrorMsg');
const { isUser, isOwner } = require('../middlewares/guard');
const { postValidation } = require('../middlewares/validation');
const { createOne, delOne, editOne, likePost, dislikePost } = require('../services/postService');


router.get('/create', isUser(), (req, res) => {
    try {
        res.render('posts/create', { title: 'Create' })
    } catch (error) {
        res.redirect('404');
    }
});

router.post('/create', isUser(), postValidation(), async (req, res) => {
    let post = {};
    try {
        if (req.postErrors) {
            throw req.postErrors;
        }
        const { title,keyword,location,date,imageUrl, description } = req.body;
        post = {
            title,
            keyword,
            location,
            date,
            imageUrl,
            description,
            owner: req.user._id
        }
        const created = await createOne(post);
        await editUser(req.user._id, created._id);
        res.redirect('/allPosts');
    } catch (error) {
        if (error.name == 'inputError' || error.name == 'ValidationError') {
            errors = formatErrorMsg(error);
            res.render('posts/create', { title: 'Create', errors, post: req.body });
        } else {
            res.redirect('/404')
        }
    }
});

router.get('/:id/details', preloadOne(), async (req, res) => {
    try {
        const post = req.post;
        if (post.ownerId == req.user?._id) {
            post.owner = true;
        }
        if (req.user && post.ownerId != req.user._id) {
            if (!post.votes.some(x => x == req.user.email)) {
                post.canVote = true;
            } else {
                post.hasVoted = true;
            }
        }
        post.votesList=post.votes.join(', ');
        res.render('posts/details', { title: 'Details', post });

    } catch (error) {
        res.redirect('/404')
    }
});

router.get('/:id/edit', preloadOne(), isOwner(), async (req, res) => {
    try {
        const post = req.post;
        res.render('posts/edit', { title: 'Edit', post });
    } catch (error) {
        res.redirect('/404')
    }
});

router.post('/:id/edit', preloadOne(), isOwner(), postValidation(), async (req, res) => {
    let post = {};
    try {
        if (req.postErrors) {
            throw req.postErrors;
        }
        const { title,keyword,location,date,imageUrl, description } = req.body;
        post = {
            title,
            keyword,
            location,
            date,
            imageUrl,
            description,
            owner: req.user._id
        }
        await editOne(req.params.id, post);
        res.redirect(`/posts/${req.params.id}/details`);
    } catch (error) {
        if (error.name == 'inputError' || error.name == 'ValidationError') {
            errors = formatErrorMsg(error);
            const post=req.body;
            post._id=req.params.id;
            res.render('posts/edit', { title: 'Edit', errors, post});
        } else {
            res.redirect('/404')
        }
    }
});

router.get('/:id/delete', preloadOne(), isOwner(), async (req, res) => {
    try {
        await delOne(req.params.id);
        res.redirect('/allPosts');
    } catch (error) {
        res.redirect('/404')
    }
});

router.get('/:id/like', isUser(), async (req, res) => {
    try {
        await likePost(req.params.id, req.user._id);
        res.redirect(`/posts/${req.params.id}/details`);
    } catch (error) {
        res.redirect('/404')
    }
});

router.get('/:id/dislike', isUser(), async (req, res) => {
    try {
        await dislikePost(req.params.id, req.user._id);
        res.redirect(`/posts/${req.params.id}/details`);
    } catch (error) {
        res.redirect('/404')
    }
});


module.exports = router;