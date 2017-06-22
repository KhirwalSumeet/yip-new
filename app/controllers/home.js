var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose');

//Passport Declaration
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session');
router.use(passport.initialize());

router.use(session({ secret: 'barc2017@KGP' ,saveUninitialized: false, resave: false})); // session secret
router.use(passport.initialize());
router.use(passport.session()); // persistent login sessions
router.use(flash());
var user = require('../models/user');
var team = require('../models/team');
var payment = require('../models/payments');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/index', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/rules', function (req, res, next) {
  res.render('rules');
});

router.post('/login', passport.authenticate('login', {
	successRedirect : '/dashboard', // redirect to the secure profile section
	failureRedirect : '/loginfailed', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));

router.get('/loginfailed', function(req, res){
	res.render('login',{ message: req.flash('loginMessage') });
});

router.get('/checkdashboard', checkloginstate, function(req,res){
	if( req.user.details) {
		res.redirect('/dashboard');
	} else {
		res.redirect('/filldetails');
	}
})

router.get('/dashboard', checkloginstate, function(req, res){
	res.render('dashboard/dashboard',{ layout: "dashboard", title: "Dashboard" });
});

router.get('/filldetails', checkloginstateonly, function(req, res){
	res.render('dashboard/filldetails', { layout: "dashboard", title: "Registeration Panel" });
});

// Make templates for password reset and reset password is complete
function checkloginstate(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  else if( req.user.details == undefined ) {
  	user.findOne({ email: req.user.email }, function(err, user){
  		if(!user.details.principal.contact)
	  		res.redirect('/filldetails');
	  	else
	  		return next();
  	});
  }
  else {
    return next();
  }
}

function checkloginstateonly(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/login');
  }
  else
    return next();
}

router.post('/filldetails', checkloginstateonly, function(req, res){
	user.findOne({ email: req.user.email }, function(err, user){
		if(err){
			console.log(err);
		} else {
			user.details = {};

			user.details.principal = {};
			user.details.principal.name = req.body.pname;
			user.details.principal.contact = req.body.pnum;
			user.details.principal.email = req.body.pemail;

			user.details.teacher = {};
			user.details.teacher.name = req.body.tname;
			user.details.teacher.contact = req.body.tnum;
			user.details.teacher.email = req.body.temail;

			user.details.school = {};
			user.details.school.address = req.body.address;
			user.details.school.city = req.body.city;
			user.details.school.state = req.body.state;
			user.details.school.contact = req.body.onum;
			req.user = user;
			user.save();

			res.render('dashboard/dashboard',{ layout: "dashboard", message: "Details Saved successfully", title: "Registeration Panel" });
		}
	})
});

router.get('/addteam', checkloginstate, function(req, res){
	res.render('dashboard/addteam',{ layout: "dashboard", title: "Add New Team" });
});

router.post('/addteam', checkloginstate, function(req, res){
	var newTeam = new team();
	newTeam.useremail = req.user.email;
	newTeam.name = req.body.tname;
	newTeam.firstStudent.name = req.body.name1;
	newTeam.firstStudent.email = req.body.email1;
	newTeam.firstStudent.contact = req.body.num1;
	newTeam.secondStudent.name = req.body.name2;
	newTeam.secondStudent.email = req.body.email2;
	newTeam.secondStudent.contact = req.body.num2;
	newTeam.thirdStudent.name = req.body.name3;
	newTeam.thirdStudent.email = req.body.email3;
	newTeam.thirdStudent.contact = req.body.num3;
	newTeam.save();
	res.render('dashboard/dashboard',{ layout: "dashboard", message: "Team added successfully", title: "Dashboard" });
});

router.get('/viewteams', checkloginstate, function(req, res){
	res.render('dashboard/viewteams',{ layout: "dashboard", title: "Your Teams" });
});

router.get('/getteams', checkloginstate, function(req, res){
	team.find({ useremail: req.user.email}, function(err, result){
		res.json(result);
	})
});

router.get('/editteam/id=:id', checkloginstate, function(req, res){
	var objectId = mongoose.Types.ObjectId(req.params.id);
	team.findOne({ useremail: req.user.email, _id: objectId }, function(err, result){
		res.render('dashboard/editteam',{ layout: "dashboard", title: "Edit Team", team: result });
	})
});

router.post('/editteam/id=:id', checkloginstate, function(req, res){
	var objectId = mongoose.Types.ObjectId(req.params.id);
	team.findOne({ useremail: req.user.email, _id: objectId }, function(err, result){
		var newTeam = new team();
		newTeam = result;
		newTeam.useremail = req.user.email;
		newTeam.name = req.body.tname;
		newTeam.firstStudent.name = req.body.name1;
		newTeam.firstStudent.email = req.body.email1;
		newTeam.firstStudent.contact = req.body.num1;
		newTeam.secondStudent.name = req.body.name2;
		newTeam.secondStudent.email = req.body.email2;
		newTeam.secondStudent.contact = req.body.num2;
		newTeam.thirdStudent.name = req.body.name3;
		newTeam.thirdStudent.email = req.body.email3;
		newTeam.thirdStudent.contact = req.body.num3;
		newTeam.save();
		res.render('dashboard/viewteams',{ layout: "dashboard", title: "Your Teams", message: " Team edited successfully" });
	})
});

router.get('/payment', checkloginstate, function(req, res){
	res.render('dashboard/payment',{ layout: "dashboard", title: "Make a payment" });
});

router.post('/payment', checkloginstate, function(req, res){
	var newPayment = new payment();
	newPayment.email = req.user.email;
	newPayment.transactionId = req.body.txn;
	newPayment.date = req.body.date;
	newPayment.mode = req.body.mode;
	newPayment.amount = req.body.amount;
	newPayment.bankName = req.body.bname;
	newPayment.bankBranch = req.body.branch;
	newPayment.status = "Pending";
	newPayment.save();
	res.render('dashboard/payment',{ layout: "dashboard", message: "Payment added successfully. Please wait for approval", title: "Payment portal" });
});

router.get('/getpayments', checkloginstate, function(req, res){
	payment.find({ email: req.user.email}, function(err, result){
		res.json(result);
	})
});

router.get('/balance', checkloginstate, function(req, res){
	payment.find({ email: req.user.email, status: "Verified"}, function(err, result){
		var amount = 0;
		for( i=0; i<result.length; i++) {
			amount = amount + parseInt(result[i]["amount"]);
		}
		team.find({ useremail: req.user.email } , function(err, result){
			tobepaid = result.length * 100 ;
			var data = {};
			data["paid"] = amount;
			data["amount"] = tobepaid;
			res.send(data);
		});
	})
});

//routes for admin
// router.get('/admin/login', adminLogin, function(req, res) {
// 	res.render('admin/login')
// })
// router.post('/admin/verify', passport.authenticate('admin/login', {
// 	successRedirect : '../admin/dashboard', // redirect to the secure profile section
// 	failureRedirect : '../admin/loginfailed', // redirect back to the signup page if there is an error
// 	failureFlash : true // allow flash messages
// }));
// router.get('/admin/loginfailed', function(req, res) {
// 	res.redirect('../admin/login')
// })
// router.get('/admin/dashboard', adminLoginStatus, function(req, res){
// 	res.render('admin/dashboard');
// });
// router.get('/admin/getPaymentStatus', adminLoginStatus, function(req, res) {
// 	user.find({}, function(err, result) {
// 		res.json(result)
// 	})
// })
// router.post('/admin/updateStatus', adminLoginStatus, function(req, res) {
// 	user.updateOne({'_id': req.body.id}, {'paymentConfirmation': req.body.selected}, function(err) {
// 		if(err) {
// 			console.log('ooops')
// 		}
// 	})
// })
// router.post('/admin/addUser', adminLoginStatus, function(req, res) {
// 	var newUser = new user()
// 	newUser.email = req.body.email
// 	newUser.password = req.body.password
// 	newUser.save()
// })

// function adminLoginStatus(req, res, next) {

//   if (!req.isAuthenticated()) {
//     res.redirect('/admin/login');
//   }
//   else
//     return next();
// }

// function adminLogin(req, res, next) {
// 	if (req.isAuthenticated()) {
// 		res.redirect('/admin/dashboard');
//   	}
//   	else
//     	return next();
// }


router.get('/admin/login', adminLogin, function(req, res) {
	res.render('admin/login')
})
router.post('/admin/verify', passport.authenticate('admin/login', {
	successRedirect : '../admin/dashboard', // redirect to the secure profile section
	failureRedirect : '../admin/loginfailed', // redirect back to the signup page if there is an error
	failureFlash : true // allow flash messages
}));
router.get('/admin/loginfailed', function(req, res) {
	res.render('admin/login',{ message: "Wrong credentials" })
})
router.get('/admin/dashboard', adminLoginStatus, function(req, res){
	res.render('admin/dashboard', { layout: "adminnew"});
});

router.get('/admin/getPaymentStatus', adminLoginStatus, function(req, res) {
	user.find({}, function(err, result) {
		res.json(result)
	})
})

router.post('/admin/updateStatus', adminLoginStatus, function(req, res) {
	payment.updateOne({'_id': req.body.id}, {'paymentConfirmation': req.body.selected}, function(err) {
		if(err) {
			console.log('ooops')
		} else {
		}
	})
})

router.post('/admin/adduser', adminLoginStatus, function(req, res) {
	user.find({ email: req.body.email }, function( err, result){
		if(result.length) {
			res.render('admin/manageusers', { layout: "adminnew", messageerror: "User with email id : "+ req.body.email+" already exists !"});
		} else {	
			var newUser = new user()
			newUser.email = req.body.email
			newUser.password = req.body.password
			newUser.save();
			res.render('admin/manageusers', { layout: "adminnew", messagesuccess: "User added successfully !"});
		}
	});
});


router.get('/admin/getusers', adminLoginStatus, function(req, res) {
	user.find({}, function(err, result) {
		res.json(result);
	})
})

router.get('/admin/manageusers', adminLoginStatus, function(req, res){
	res.render('admin/manageusers', { layout: "adminnew"});
});

router.get('/admin/payments', adminLoginStatus, function(req, res){
	res.render('admin/payments', { layout: "adminnew"});
});

router.get('/admin/payments/updateSuccess', adminLoginStatus, function(req, res){
	res.render('admin/payments', { layout: "adminnew", messagesuccess: "Status updated successfully"});
});

router.get('/admin/payments/updateError', adminLoginStatus, function(req, res){
	res.render('admin/payments', { layout: "adminnew", messageerror: "Status cannot be updated"});
});

router.get('/admin/getpayments', adminLoginStatus, function(req, res) {
	payment.find({}, function(err, result) {
		res.json(result)
	});
});

router.get('/admin/updateStatus/id=:id&&value=:value', adminLoginStatus, function(req, res) {
	
	var objectId = mongoose.Types.ObjectId(req.params.id);
	payment.updateOne({'_id': objectId},{ 'status': req.params.value}, function(err) {
		if(err) {
			console.log(err);
			res.send("error");
		} else {
			res.send("success");
		}
	});
});

function adminLoginStatus(req, res, next) {

  if (!req.isAuthenticated()) {
    res.redirect('/admin/login');
  }
  else
    return next();
}

function adminLogin(req, res, next) {
	if (req.isAuthenticated()) {
		res.redirect('/admin/dashboard');
  	}
  	else
    	return next();
}