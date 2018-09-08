var mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect('mongodb://root:root1995@ds125362.mlab.com:25362/blogk',{
	useNewUrlParser: true
});
// mongoose.connect('mongodb://myUserAdmin:abc123@localhost:27017/medium',{
// 	useNewUrlParser: true
// });