var BrowserBox = require('browserbox');
var MailParser = require('mailparser').MailParser

module.exports.getMailList = function(req, res, mailbox) {
	client = new BrowserBox(req.session.box.host, req.session.box.port, req.session.box.options);

	client.connect();

	if (mailbox == undefined) {
		mailbox = 'inbox';
	}

	client.onerror = function(err) {
		res.send(err);
	}

	client.onauth = function() {
		console.log('Authentification succeed !');
		client.selectMailbox(mailbox, function(err) {
			if (err) {
				res.send(err);
			} else {
				client.listMessages('1:*', ['envelope', 'bodystructure'], function(err, message) {
					res.send({code: "ok", data: message});
					client.close();
				});				
			}
		});
	}
}

module.exports.getMailContent = function(req, res, mailbox) {
	client = new BrowserBox(req.session.box.host, req.session.box.port, req.session.box.options);

	client.connect();

	client.onerror = function(err) {
		res.send(err);
	}
	if (mailbox == undefined) {
		mailbox = 'inbox';
	}

	client.onauth = function() {
		client.selectMailbox(mailbox, function(err) {
			if (err) {
				res.send(err);
			} else {
				client.listMessages(req.params.id, ['body[]'], function(err, message) {
					if (err || message.length == 0) {
						res.send({id: 0, content: 'No message with id ' + req.params.id});
					} else {
						var mailparser = new MailParser();
						mailparser.on('end', function(mail) {
							var body = {
								id: req.params.id,
								content: (mail.text ? mail.text : mail.html)
							}
							res.send(body);
							client.close();
						});
						mailparser.write(message[0]['body[]']);
						mailparser.end();
					}
				});
			}
		});
	}
}

module.exports.deleteMail = function(req, res) {
	client = new BrowserBox(req.session.box.host, req.session.box.port, req.session.box.options);

	client.connect();

	client.onerror = function(err) {
		res.send(err);
	}

	client.onauth = function() {
		client.selectMailbox('inbox', function(err) {
			if (err) {
				res.send(err);
			} else {
				client.deleteMessages(req.params.id, function(err) {
					if (err) {
						res.send({status: 'ko'});
					} else {
						res.send({status: 'ok'});
					}
				client.close();
				});
			}
		});
	}
}

module.exports.listMailbox = function(req, res) {
	client = new BrowserBox(req.session.box.host, req.session.box.port, req.session.box.options);

	client.connect();

	client.onauth = function() {
		client.listMailboxes(function(err, mailboxes) {
			console.log(mailboxes);
			res.send(mailboxes);
		});
	}
}