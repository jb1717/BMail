var config = require('../.config.json');

module.exports = function() {
	return (function(req, res, next) {
		if (req.session.box == undefined) {
			req.session.box = {
				host: config.reception.host,
				port: config.reception.port,
				options: {
					useSecureTransport: true,
					auth: {
						user: config.auth.user,
						pass: config.auth.pass
					}
				}
			};
		}
		next();
	});
};
