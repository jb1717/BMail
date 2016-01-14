var express = require('express');
var BrowserBox = require('browserbox');
var MailParser = require('mailparser').MailParser
var imap = require('./imap.js');
var pop3 = require('./pop.js');
var sender = require('./sendMail.js');
var config = require('../.config.json')

var router = express.Router();

var protocol = config.retr_protocol;

router.get('/', function(req, res) {
	res.write('you can request /test');
	res.end();
});

router.get('/mail', function(req, res) {
	if (protocol == 'imap') {
		imap.getMailList(req, res);
	} else if (protocol == 'pop3') {
		pop3.getMailList(req, res);
	} else {
		res.send({status: 'Unknown protocol !'});
	}
});

router.get('/mail/:id', function(req, res) {
	if (protocol == 'imap') {
		imap.getMailContent(req, res);
	} else if (protocol == 'pop3') {
		pop3.getMailContent(req, res);
	} else {
		res.send({status: 'Unknown protocol !'});
	}
});

router.post('/mail', function(req, res) {
	sender.sendMail(req, res);
});

router.delete('/mail/:id', function(req, res) {
	if (protocol == 'imap') {
		imap.deleteMail(req, res);
	} else if (protocol == 'pop3') {
		pop3.deleteMail(req, res);
	} else {
		res.send({status: 'Unknown protocol !'});
	}
});

router.get('/mailbox', function(req, res) {
	if (protocol == 'imap') {
		imap.listMailbox(req, res);
	} else if (protocol == 'pop3') {
		res.send({status: 'Disponible que pour le protocole imap'});
	} else {
		res.send({status: 'Unknown protocol !'});		
	}
});

router.get('/sent', function(req, res) {
	if (protocol == 'imap') {

		imap.getMailList(req, res, '[Gmail]/Messages envoy&AOk-s');
	} else if (protocol == 'pop3') {
		res.send({status: 'Disponible que pour le protocole imap'});
	} else {
		res.send({status: 'Unknown protocol !'});
	}
});

router.get('/sent/:id', function(req, res) {
	if (protocol == 'imap') {

		imap.getMailContent(req, res, '[Gmail]/Messages envoy&AOk-s');
	} else if (protocol == 'pop3') {
		res.send({status: 'Disponible que pour le protocole imap'});
	} else {
		res.send({status: 'Unknown protocol !'});
	}
});

router.get('/trash', function(req, res) {
	if (protocol == 'imap') {
		imap.getMailList(req, res, '[Gmail]/Corbeille');
	} else if (protocol == 'pop3') {
		res.send({status: 'Disponible que pour le protocole imap'});
	} else {
		res.send({status: 'Unknown protocol !'});		
	}
});

module.exports.router = router;
