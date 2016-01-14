function findById(tab, id) {
    for (var i = 0; i < tab.length; i++) {
        if (tab[i]["#"] == id) {
            return (tab[i]);
        }
    }
    return (null);
}

function getBody(mail, id, prom, $http, ipAPI) {
    var req_body = $http.get(ipAPI + "/mail/" + id);

    req_body.success(function(data, status) {
        if (data.id == 0)
            prom.reject("Impossible de charger l'email")
            else {
                mail.content = data.content;
                prom.resolve(mail);
            }
    });
}

app.factory("MailFactory", [
    "ipAPI",
    "$resource",
    function MailFactory(ipAPI, $resource) {

        var MailResource = $resource(ipAPI + "/mail/:id", null, {
            'get': {method:'GET', isArray: false},
            'query': {method:'GET', isArray: false}
        });
        var mails = MailResource.query();

        // l'objet que je renvois
        var facto = {
            getMails: function() {
                return (mails);
            },
            getMail: function(id) {
                return (mails);
            },
            getContentMail: function(mail) {
                return (MailResource.get({id: mail["#"]}));
            },
            refresh: function() {
                mails = MailResource.query();
            },
            new: function(param) {
                return (MailResource.save(param));
            },
            delete: function(id) { 
                return (MailResource.delete({id: id}));
            }
        };

        return (facto);
    }
]);

app.factory("SentFactory", [
    "ipAPI",
    "$resource",
    function SentFactory(ipAPI, $resource) {

        var SentResource = $resource(ipAPI + "/sent/:id", null, {
            'get': {method:'GET', isArray: false},
            'query': {method:'GET', isArray: false}
        });

        var mails = SentResource.query();

        // l'objet que je renvois
        var facto = {
            getMails: function() {
                return (mails);
            },
            getMail: function(id) {
                return (mails);
            },
            getContentMail: function(mail) {
                return (SentResource.get({id: mail["#"]}));
            },
            refresh: function() {
                mails = SentResource.query();
            }
        };

        return (facto);
    }
]);