/*!
 * SandwichJS v0.0.1
 * https://github.com/Saartje87/SandwichJS
 *
 * Copyright 2013 Niek Saarberg
 * Licensed MIT
 *
 * Build date 2013-12-04 18:01
 */
(function ( name, context, definition ) {
	
	this[name] = definition(context);

})('Sandwich', this, function ( context ) {

'use strict';

var Sandwich = {};


var _AppInit = false;

Sandwich.Application = {

	rootElement: 'body',

	_modules: {},

	/**
	 * Create out application!
	 */
	create: function () {

		var key,
			app = Sandwich.Application,
			modules = app._modules,
			App = {};

		if( _AppInit ) {

			return Sandwich.Error.report('Sandwich.Application.create already initialized');
		}

		App.rootElement = PB.$(app.rootElement);

		for( key in modules ) {

			if( modules.hasOwnProperty(key) ) {

				App[key] = modules[key]();
			}
		}

		_AppInit = true;

		return App;
	},

	/**
	 * 
	 */
	define: function ( name, callback ) {

		Sandwich.Application._modules[name] = callback;
	}
};
Sandwich.Error = {

	report: function ( msg ) {

		throw new Error(msg);
	}
};
// Sandwich.Application.define('Router', ['Module1'], function ( module1 ) {
// Sandwich.Module.define('Router', ['Dependencies', 'two'], function ( $1, $2 ) {  })
// Sandwich.Application.registerModule('Router');

// Sandwich.Module.define('Router', ['Route'], function ( route ) {});
Sandwich.Application.define('Router', function () {

	var routes = [];

	if( !('onhashchange' in window) ) {

		throw new Error('Browser not supported');
	}

	PB.$(window).on('hashchange', execRoute);

	// Execute first route when dom is ready (hopefully this will always trigger after all js is loaded)
	PB.ready(execRoute);

	/**
	 *
	 */
	function execRoute ( url, options ) {

		var match;

		// If no url is given use the current hash
		if( typeof url !== 'string' ) {

			url = window.location.hash;
		}

		url = cleanUrl(url);

		if( match = matchRoute(url) ) {

			match.callback.apply(match.callback, match.params);
		}
	}

	/**
	 *
	 */
	function cleanUrl ( url ) {

		return url
			.replace(/^#?\!?/, '')					// Strip #!
			.replace(/^\/\/+/g, '/')				// Replace /// => /
			.replace(/^[\/|\s]+|[\/|\s]+$/g, '');	// Trim slashes and whitespaces
	}

	/**
	 *
	 */
	function matchRoute ( url ) {

		var matchedRoute,
			params = {},
			i = 0;

		for( ; i < routes.length; i++ ) {

			if( params = routes[i].matches(url) ) {

				matchedRoute = routes[i];
				break;
			}
		}

		if( !matchedRoute ) {

			return false;
		}

		return {

			route: matchedRoute.route,
			callback: matchedRoute.callback,
			params: params
		};
	}

	var CreateRoute = {

		/**
		 *
		 */
		compile: function ( route ) {

			var regex = '^',
				chr = '',
				groupName = '',
				i = 0,
				length = route.length;

			for( ; i < length; i++ ) {

				chr = route[i];

				switch ( chr ) {

					case '/':
						regex += '\\/';
						break;

					case ':':
						i = CreateRoute.skipGroup(i, route);
						regex += '([a-z0-9\.\\s_-]+)';
						break;

					case '*':
						i = CreateRoute.skipGroup(i, route);
						regex += '(.*)';
						break;

					default:
						regex += chr;
						break;
				}
			}

			regex += '$';

			regex = new RegExp(regex, 'i');

			return function ( url ) {

				var result = url.match(regex);

				return result ? Array.prototype.slice.call(result, 1) : null;
			};
		},

		/**
		 *
		 */
		skipGroup: function ( i, route ) {

			for( i += 1; i < route.length; i++ ) {

				if( !(/[a-zA-Z0-9]/).test(route[i]) ) {

					return i - 1;
				}
			}

			return i;
		}
	};

	return {

		/**
		 *
		 */
		navigate: function ( url, options ) {

			// Strip the protocol + host from url
			url = url.replace(window.location.protocol+'//'+window.location.hostname, '');

			// Execute request silently
			if( options && options.silent ) {
				
				return execRoute(url, options);
			}

			window.location.hash = '!'+cleanUrl(url);
		},

		/**
		 *
		 */
		when: function ( route, callback ) {

			if( typeof route !== 'string' ) {

				Sandwich.Error.report('Router.when::First argument must be a string');
			}

			if( typeof callback !== 'function' ) {

				Sandwich.Error.report('Router.when::Second argument must be a function');
			}

			route = cleanUrl(route);

			routes.unshift({

				route: route,
				matches: CreateRoute.compile(route),
				callback: callback
			});
		}
	}
});

/*
var Router = function () {


};

Router.prototype = {};

Sandwich.Application.register('Router', function () {

	return new Router();
});
*/

// Sandwich.Application.regsiter('Router', Sandwich.Module.Router);
return Sandwich;
});

