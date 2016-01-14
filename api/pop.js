var MailParser = require('mailparser').MailParser
var mailparser = new MailParser();
var POP3Client = require('poplib');

var totalMessages = 0;
var currentMessage = 0;

module.exports.getMailList = function(req, res) {
	client = new POP3Client(req.session.box.port, req.session.box.host, {
		tlserrs: false,
		enabletls: true,
		debug: false
	});
	client.on('error', function(err) {
		console.log(err);
	});
	client.on('connect', function() {
		client.login(req.session.box.options.auth.user, req.session.box.options.auth.pass);
	});
	client.on('login', function(status, rawdata) {
		if (status) {
			client.list();
		} else {
			res.send({status: 'Authentification failed !'});
		}
	});

	client.on('list', function(status, msgcount, msgnumber, data, rawdata) {
	if (status == false) {
		res.send({status: 'Error to get the list of e-mail'});
		client.quit();
	} else {
		if (msgcount > 0) {
			totalMessages = msgcount;
			currentMessage = totalMessages - 150;//1;
			client.retr(currentMessage);
		} else {
			res.send({status: 'There is no messages in your inbox.'});
			client.rset();
		}
	}
	});

	var listHeaders = {code: "ok", data: []};

	client.on('retr', function(status, msgnumber, data, rawdata) {
		if (status) {
			var mailparser = new MailParser();
			mailparser.on('end', function(mail) {
				currentMessage += 1;
				listHeaders.data.push({'#': msgnumber, 'envelope': {'date': mail.date, 'subject': mail.subject, 'sender': mail.from}});
				client.dele(msgnumber);
			});

			mailparser.write(data);
			mailparser.end();

		} else {
			res.send({status: 'Fail when trying to get message number ' + msgnumber});
			client.rset();
		}
	});

	client.on('dele', function(status, msgnumber, data, rawdata) {
		if (status) {
			if (currentMessage > totalMessages) {
				res.send(listHeaders);
				client.rset();
			} else {
				client.retr(currentMessage);
			}
		} else {
			client.rset();
		}
	});

	client.on('rset', function(status, rawdata) {
	});

};

module.exports.getMailContent = function(req, res) {
	client = new POP3Client(req.session.box.port, req.session.box.host, {
		tlserrs: false,
		enabletls: true,
		debug: true
	});
	client.on('connect', function() {
		console.log('Connect success !');
		client.login(req.session.box.options.auth.user, req.session.box.options.auth.pass);
	});
	client.on('login', function(status, rawdata) {
		if (status) {
			console.log('Authentification succeed !');
			client.retr(req.params.id);
		} else {
			console.log('Authentification failed !');
			res.send('Authentification failed !');
		}
	});

	client.on('retr', function(status, msgnumber, data, rawdata) {
		if (status) {
			var mailparser = new MailParser();
			mailparser.on('end', function(mail) {
				if (mail.text) {
					res.send({id: msgnumber, content: mail.text});
				} else if (mail.html) {
					res.send({id: msgnumber, content: mail.html});
				} else {
					res.send({id: msgnumber, content: ""});
				}
			});
			mailparser.write(data);
			mailparser.end();
		} else {
			res.send('Fail when trying to get message number ' + msgnumber);
			client.rset();
		}
	});
};

module.exports.deleteMail = function(req, res) {
	client = new POP3Client(req.session.box.port, req.session.box.host, {
		tlserrs: false,
		enabletls: true,
		debug: true
	});
	client.on('connect', function() {
		console.log('Connect success !');
		client.login(req.session.box.options.auth.user, req.session.box.options.auth.pass);
	});
	client.on('login', function(status, rawdata) {
		if (status) {
			console.log('Authentification succeed !');
			client.dele(req.params.id);
		} else {
			console.log('Authentification failed !');
			res.send('Authentification failed !');
		}
	});
	client.on('dele', function(status, msgnumber, data, rawdata) {
		if (status) {
			res.send('Message deleted !');
		} else {
			res.send('Can\'t delete message !');
		}
	});
}
