var express = require('express');
var router = express.Router();

var multer  = require('multer');
var fs = require('fs');

var Image = require('../models/Image');
var Category = require('../models/Category');

/**
 * Upload a new Image
 */
router.get('/upload', async function(req, res){
	try {
		var categories = await Category.find({}).exec();
		
		res.render('image_upload', { 
			title: 'Upload image',
			tab: 'blog',
			categories: categories
		});
	} catch (err) {
		res.send({
            name: err.name,
            message: err.message
        });
	}
});
router.post('/upload', function(req, res){
	// Initialize data
    let IMAGE_KEY = "image";
    let PREFIX_NAME = IMAGE_KEY+'_';
    let FILE_PATH = "public/uploads/";
    // let STATIC_URL = req.protocol + '://' + req.get('host') + '/uploads/';
    let STATIC_URL = "/uploads/";
    
    // Config image upload
    let storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, FILE_PATH);
        },
        filename: function (req, file, cb) {
            cb(null, PREFIX_NAME + '_' + Date.now() + '.jpg');
        }
    });
    let upload = multer({ storage: storage }).array(IMAGE_KEY, 10);

    upload(req, res, function (err) {
        if (err) return res.status(500).json({success: false, errors: err});
        // Validate files
        if (req.files.length<=0) return res.status(401).json({success: false, message: 'Bad request, missing '+ IMAGE_KEY + ' files.'  });
		
		let image = new Image({
			url: STATIC_URL + req.files[0].filename,
			path: req.files[0].path
		});
		image.save();

		req.flash('message', 'Upload a image successfully.');

        return res.redirect('/image/list');
    });
});


/**
 * Show list
 */
router.get('/list', async function(req, res){
	try {
		var categories = await Category.find({}).exec();
		
		Image.find().
		sort({ dateOfCreate: -1 }).
		exec(function(err, images) {
			if(err) return res.status(500).send({ success: false, errors: err });

			res.render('image_list', { 
				title: 'Upload image',
				tab: 'blog',
				categories: categories,
				user: req.user,
				message: req.flash('message'),
				images: images
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
 * Delete image
 */
router.get('/delete/:id', function(req, res){

	Image.findById(req.params.id, function(err, image){
		if(err) return res.send(err);

		if( fs.existsSync(image.path) ) {
			fs.unlinkSync(image.path);
		}

		image.remove(function(err){
			if(err) return res.send(err);

			req.flash('message', 'A Image is deleted.');

			res.redirect('/image/list');
		});
	});
	
});


module.exports = router;