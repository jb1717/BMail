var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../.config.json')

var transporter = nodemailer.createTransport(smtpTransport({
	host: config.sent.host,
	secure: true,
	auth: {
		user: config.auth.user,
		pass: config.auth.pass
	}
}));

module.exports.sendMail = function(req, res) {
	var mailOptions = {
		from: config.auth.user,
		to: req.body.dest,
		subject: req.body.subject,
		text: req.body.message
	};
	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
			res.send({status: 'ko'});
		} else {
			res.send({status: 'ok'});
		}
	});
}