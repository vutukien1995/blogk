var express = require('express');
var router = express.Router();

var Post = require('../models/Post');
var Category = require('../models/Category');

// Check Authenticating
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/user/login');
};

/**
 * Create a new Post
 */
router.get('/create', isAuthenticated, async function(req, res){
	try {
		var categories = await Category.find({}).exec();

		res.render('post_create', {
			title: 'Create new post',
			categories: categories,
			tab: 'blog'
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
	}
});
router.post('/create', function(req, res){
	let post = new Post({
		title : req.body.title,
		image : req.body.image,
		content : req.body.content,
		categories : req.body.categories
	});

	post.save(function(err, newPost){
		if(err) res.send(err);

		res.redirect('/post/show/'+newPost._id);
	});
});

/**
 * Show post
 */
router.get('/show/:id', async function(req, res){
	try {
		var categories = await Category.find({}).exec();

		Post.findById(req.params.id).exec(function(err, post) {
			if(err) return res.send(err);

			if(!post) return res.send("404 not found");
			res.render('post', {
				title: 'Post',
				tab: 'blog',
				user: req.user,
				categories: categories,
				post: post
			});
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
	}
});

/**
 * Update a post
 */
router.get('/update/:id', async function(req, res){
	try {
		var categories = await Category.find({}).exec();

		var posts = await Post.find({}).exec();

		Post.findById(req.params.id).exec(function(err, post) {
			if(err) return res.send(err);

			if(!post) return res.send("404 not found");
			res.render('post_update', { 
				title: 'Post',
				tab: 'blog',
				categories: categories,
				post: post,
				posts: posts
			});
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
	}
	
});
router.post('/update', function(req, res){
	Post.findById(req.body.id).exec(function(err, post) {
		if(err) return res.send(err);
		if(!post) return res.send("404 not found");
		post.title = req.body.title;
		post.image = req.body.image;
		post.content = req.body.content;
		post.categories = req.body.categories;

		post.save(function(err, newPost){
			if(err) res.send(err);

			res.redirect('/post/show/'+newPost._id);
		});
	});
});




module.exports = router;


