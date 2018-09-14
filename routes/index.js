var express = require('express');
var router = express.Router();

var Post = require('../models/Post');
var Image = require('../models/Image');
var Category = require('../models/Category');

/* GET home page. */
router.get('/', function(req, res){
	res.redirect('/0');
});

router.get('/:page', async function(req, res) {
    try {
        page = req.params.page;
    
        var options = {
            sort: { dateOfCreate: -1 },
            offset: parseInt(page),
            limit: 10
        };

        var categories = await Category.find({}).exec();
        
        Post.paginate({}, options).
        then(function (result) {

            //if (err) return res.send(err);
            var posts = result.docs;

            posts.forEach(function(post) {
                var str = post.content;
                if(str) post.content = str.slice(0, 150);
            });

            res.render('index', {
                title: 'Blog K',
                tab: 'home',
                posts: posts,
                categories: categories,
                pages: result.total/result.limit+1,
                page: result.offset+1,
                limit: result.limit,
                user: req.user
            });
        });
    } catch (err) {
        res.send({
            name: err.name,
            message: err.message
        });
    }
});

module.exports = router;
