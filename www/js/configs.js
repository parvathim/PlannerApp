angular.module('starter.configs', []).
    constant('apiUrls', (function() {
        var base, base2, protocol;

        //base = 'http://192.169.1.104:3000/';
        //base = 'http://192.168.1.60:3000/';
        //base = 'http://54.255.174.220/';
        base = 'http://192.168.43.119:2000/';
	//base = 'http://192.168.1.4:2000/';
        //console.log("api base: ",base);

        base2 = 'api/';

        return {
            sessionLogin:       base + base2 + 'session/',
            users:              base + base2 + 'users/',
            plan:         base + base2 + 'plan/'
        }
    })());

