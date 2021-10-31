const { getAll} = require('../services/postService');

const router = require('express').Router();

router.get('/', async (req, res) => {
    try {
        res.render('home/home',{title:'Home page'})
    } catch (error) {
        res.redirect('/404');
    }
});
router.get('/allPosts', async (req, res) => {
    try {
        const posts=await getAll();
        res.render('home/all-posts',{title:'Home page',posts})
    } catch (error) {
        res.redirect('/404');
    }
});


module.exports = router;