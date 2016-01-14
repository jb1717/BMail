// les controlleurs

app.controller('NavCtrl', [
    "MailFactory",
    "$scope",
    function(MailFactory, $scope) {
        $scope.refresh = function () {
            window.location.reload()
        };
    }
]);

app.controller('IndexCtrl', [
    "$scope",
    "MailFactory",
    "$rootScope",
    function ($scope, MailFactory, $rootScope) {
        $rootScope.error = "";
        $scope.mails = [];
        $rootScope.loading = true;
        var mails = MailFactory.getMails();
        mails.$promise.then(function() {
            $rootScope.loading = false;
            if (mails.code != "ok")
                $rootScope.error = "Impossible de récupérer les mails";
            else
                $scope.mails = mails.data;
        }, function() {
            $rootScope.loading = false;
            $scope.mails = [];
            $rootScope.error = "Erreur de connexion";
        });
    }
]);

app.controller('SentCtrl', [
    "$scope",
    "SentFactory",
    "$rootScope",
    function ($scope, SentFactory, $rootScope) {
        $rootScope.error = "";
        $scope.mails = [];
        $rootScope.loading = true;
        var mailsSent = SentFactory.getMails();
        mailsSent.$promise.then(function() {
            $rootScope.loading = false;
            if (mailsSent.code == "ok")
                $scope.mailsSent = mailsSent.data;
            else if (mailsSent.code == "NONEXISTENT")
                $scope.noMessage = "Aucun message";                
            else
                $rootScope.error = "Impossible de récupérer les mails";
        }, function() {
            $rootScope.loading = false;
            $scope.mails = [];
            $rootScope.error = "Erreur de connexion";
        });
    }
]);

app.controller('ReadSentCtrl', [
    "$scope",
    "$routeParams",
    "SentFactory",
    "$rootScope",
    "ipAPI",
    "$location",
    function ($scope, $routeParams, SentFactory, $rootScope, ipAPI, $location) {
        $rootScope.loading = true;
        $rootScope.error = "";
        var id = $routeParams.id;
        var mails = SentFactory.getMail(id);
        mails.$promise.then(function() {
            $rootScope.loading = false;
            if (mails.code != "ok")
                $rootScope.error = "Impossible de récupérer le mail";
            else {
                var mail = findById(mails.data, id);
                if (mail == undefined)
                    $rootScope.error = "Mail introuvable";
                else {
                    $scope.mail = mail;
                    if (mail.content == undefined) {
                        $rootScope.loading = true;
                        var content = SentFactory.getContentMail(mail);
                        content.$promise.then(function() {
                            $rootScope.loading = false;
                            mail.content = content.content;
                        }, function() {
                            $rootScope.loading = false;
                            $rootScope.error = "Connexion impossible";
                        });
                    }
                }
            }
        }, function() {
            $rootScope.loading = false;
            $rootScope.error = "Erreur de connexion";  
        });
    }
]);

app.controller('ReadMailCtrl', [
    "$scope",
    "$routeParams",
    "MailFactory",
    "$rootScope",
    "ipAPI",
    "$location",
    function ($scope, $routeParams, MailFactory, $rootScope, ipAPI, $location) {
        $rootScope.loading = true;
        $rootScope.error = "";
        var id = $routeParams.id;
        var mails = MailFactory.getMail(id);
        mails.$promise.then(function() {
            $rootScope.loading = false;
            if (mails.code != "ok")
                $rootScope.error = "Impossible de récupérer le mail";
            else {
                var mail = findById(mails.data, id);
                if (mail == undefined)
                    $rootScope.error = "Mail introuvable";
                else {
                    $scope.mail = mail;
                    if (mail.content == undefined) {
                        $rootScope.loading = true;
                        var content = MailFactory.getContentMail(mail);
                        content.$promise.then(function() {
                            $rootScope.loading = false;
                            mail.content = content.content;
                        }, function() {
                            $rootScope.loading = false;
                            $rootScope.error = "Connexion impossible";
                        });
                    }
                }
            }
        }, function() {
            $rootScope.loading = false;
            $rootScope.error = "Erreur de connexion";  
        });

        $scope.delete = function() {
            $rootScope.loading = true;
            $scope.error = "";
            var id = $scope.mail["#"];
            var req = MailFactory.delete(id);
            req.$promise.then(function(data) {
                $rootScope.loading = false;
                if (data.status == "ok") {
                    MailFactory.refresh();
                    $location.path("#/");
                }
                else {
                    $scope.error = "Impossible de supprimer le mail.";
                }                
            }, function() {
                $rootScope.loading = false;
                $rootScope.error = "Erreur de connexion";
            });
        }
    }
]);

app.controller('NewCtrl', [
    "$scope",
    "$http",
    "$rootScope",
    function ($scope, $http, $rootScope) {
        $rootScope.error = "";
    }
]);

app.controller('SendMailCtrl', [
    "$scope",
    "MailFactory",
    "SentFactory",
    "$rootScope",
    function ($scope, MailFactory, SentFactory, $rootScope) {

        $scope.submit = function() {
            $rootScope.loading = true;
            $scope.error = "";
            $scope.success = "";
            var param = {
                dest: $scope.dest,
                subject: $scope.subject,
                message: $scope.message
            };
            var send = MailFactory.new(param);
            send.$promise.then(function(data) {
                $rootScope.loading = false;
                if (data.status == "ok") {
                    $scope.success = "Message envoyé";
                    SentFactory.refresh();
                    $scope.dest = "";
                    $scope.subject = "";
                    $scope.message = "";
                }
                else {
                    $scope.error = "Impossible d'envoyer le mail";
                }
            }, function () {
                $rootScope.loading = false;
                $rootScope.error = "Erreur de connexion";
            });
        };

    }
]);