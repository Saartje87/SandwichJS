/*!
 * SandwichJS v0.0.1
 * https://github.com/Saartje87/SandwichJS
 *
 * Copyright 2014 Niek Saarberg
 * Licensed MIT
 *
 * Build date 2014-xxxxxxxxx
 */
(function ( name, context, definition ) {
	
	this[name] = definition(context);

})('Sandwich', this, function ( context ) {

'use strict';

var Sandwich = {};


Sandwich.Log = function () {


};

Sandwich.Error = function () {

};

Sandwich.assert = function ( a, message ) {

	if( a !== true ) {

		throw Error(message);
	}
}

// Sandwich stores namespaces in a private object, so no setting in the global scope
var _namespaces = {};

/**
 * Set namespace
 */
Sandwich.setNS = function setNS ( namespace, data ) {

	var parts = namespace.split('.'),
		ns = _namespaces,
		name = parts.pop(),
		i = 0;

	for( ; i < parts.length; i++ ) {

		if( !ns[parts[i]] ) {

			ns[parts[i]] = {};
		}

		ns = ns[parts[i]];
	}

	ns[name] = data;
};

/**
 * Get namespace
 */
Sandwich.getNS = function getNS ( namespace ) {

	var parts = namespace.split('.'),
		ns = _namespaces,
		i = 0;

	for( ; i < parts.length; i++ ) {

		if( !ns[parts[i]] ) {

			// console.warn('Namespace `'+namespace+'` not found');
			return undefined;
		}

		ns = ns[parts[i]];
	}

	return ns;
};

/**
 * Create a wrapper object to observe any changes in an object/array
 */

/* Example implementation

var observableObject = SW.ObservableObject({}),
	observableArray = SW.ObservableArray([]);

SW.Binding.set('Observable', observableObject);
SW.Binding.observe('Observable', 'change', function () {

	// observable changed
});
*/


Sandwich.module = function ( namespace, dependencies, module ) {

	if( !module ) {

		module = dependencies;
		dependencies = null;
	} else {

		// Should be a validation over dependencies
		dependencies = dependencies.map(Sandwich.getNS);
	}

	// 
	if( namespace && !module ) {

		return Sandwich.getNS(namespace);
	}

	if( typeof namespace !== 'string' ) {

		// Sandwich.assert(moduleName !== 'string', 'Sandwich.Module.define::moduleName must be a string')
		console.warn('Sandwich.module::namespace must be a string');
	}

	if( typeof module !== 'function' ) {

		console.warn('Sandwich.module::module definition must be function');
	}

	if( Sandwich.getNS(namespace) ) {

		console.warn('Sandwich.module::module `'+namespace+'` already declared');
		throw Error();
	}

	Sandwich.setNS(namespace, module.apply(null, dependencies || []));
};

Sandwich.module('Application', function () {

	var _registeredModules = {},
		_isReady = false;

	/**
	 *
	 */
	function run () {

		console.info('Run Sandwich');

		if( _isReady ) {

			return;
		}

		PB.each(_registeredModules, function ( name, definition ) {

			Sandwich[name] = definition();
		});

		_isReady = true;
	};

	/**
	 * Register startup methods, the returned value will be assigned to Sandwich namespace
	 */
	function register ( name, definition ) {

		_registeredModules[name] = definition;
	};

	return {

		run: run,
		register: register
	};
});

Sandwich.Application = Sandwich.module('Application');


// When application is created, will register App.Router
// options => options given to create application
/*Sandwich.Application.register('Router', function ( options ) {

	var Router = Sandwich.module('Router');

	Router.start();

	return Router;
});*/

Sandwich.module('Route', function () {

	var routes = [];

	/**
	 *
	 */
	function match () {

		console.log('Router.match');

	};

	/**
	 *
	 */
	function register ( route, callback, context ) {

		routes.push({

			route: route,
			matches: _compile(route),
			callback: callback,
			context: context
		});
	};

	/**
	 *
	 */
	function match ( url ) {

		var routeParams, matchedRoute,
			i = 0;

		for( ; i < routes.length; i++ ) {

			if( routeParams = routes[i].matches(url) ) {

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
			params: routeParams
		};
	}

	/**
	 *
	 */
	function _compile ( route ) {

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
					i = _skip(i, route);
					regex += '([a-z0-9\.\\s_-]+)';
					break;

				case '*':
					i = _skip(i, route);
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
	};

	/**
	 *
	 */
	function _skip ( i, route ) {

		for( i += 1; i < route.length; i++ ) {

			if( !(/[a-zA-Z0-9]/).test(route[i]) ) {

				return i - 1;
			}
		}

		return i;
	};

	return {

		name: 'Route',
		match: match,
		register: register
	};
});

Sandwich.module('Router', ['Route'], function ( Route ) {

	// Define a router Api, will handle page navigation changes
	var _routerApi;

	/**
	 * Start router and start listening to changes in the route
	 */
	function start ( options ) {

		options || (options = {});

		if( !options.router ) {

			options.router = 'Hash';
		}

		_routerApi = Sandwich.module('Router.API.'+options.router);

		// Should throw an error in development environment
		Sandwich.assert(PB.type(_routerApi) === 'object', 'router api not found `Router.API.'+options.router+'`'); //.error();

		_routerApi.on('change', _onChangeRoute);
		_routerApi.start();
	};

	/**
	 *
	 */
	function when ( route, callback, context ) {

		Sandwich.assert(PB.type(route) === 'string', 'Router.when route argument expected to be a string');
		Sandwich.assert(PB.type(callback) === 'function', 'Router.when callback argument expected to be a function');

		// Trim route
		route = _cleanUrl(route);

		// Register route
		Route.register(route, callback, context);
	};

	/**
	 *
	 */
	function run ( url ) {

		var match;

		url = _cleanUrl(url);

		match = Route.match(url)

		if( match ) {

			match.callback.apply(match.callback, match.params);
		}
	};

	/**
	 * 
	 */
	function _cleanUrl ( url ) {

		return url
			.replace(/^#?\!?/, '')					// Strip #!
			.replace(/^\/\/+/g, '/')				// Replace /// => /
			.replace(/^[\/|\s]+|[\/|\s]+$/g, '');	// Trim slashes and whitespaces
	};

	/**
	 *
	 */
	function _onChangeRoute ( route ) {

		run(route);
	};

	return {

		start: start,
		// stop: stop,
		when: when,
		run: run

		/*
		navigate: navigate*/
	};
});

// When application is created, will register App.Router
// options => options given to create application
Sandwich.Application.register('Router', function ( options ) {

	var Router = Sandwich.module('Router');

	Router.start();

	return Router;
});

/**
 * Hashbang implementation for Sandwich.Router
 */
Sandwich.module('Router.API.Hash', ['Router'], function ( Router ) {

	var observer = new PB.Observer();

	/**
	 * 'Proxy' method to handle context problem when we would expose observer.on instead
	 */
	function on ( type, fn, context ) {

		observer.on(type, fn, context);
	};

	/**
	 *
	 */
	function start () {

		Sandwich.assert('onhashchange' in window, 'onhashchange event not supported by browser');

		PB.$(window).on('hashchange', _execRoute);

		// Execute first route when dom is ready.
		// hopefully this will always trigger after all js is loaded
		// @todo tests
		PB.ready(_execRoute);
	};

	/**
	 *
	 */
	function _execRoute ( url ) {

		// If no url is given use the current hash
		if( typeof url !== 'string' ) {

			url = window.location.hash;
		}

		// Run router with new location
		Router.run(url);
	};

	return {

		name: 'Router.API.Hash',
		start: start,
		on: on
	};
});

/**
 * Hashbang implementation for Sandwich.Router
 */
Sandwich.module('Router.API.Pushstate', ['Router'], function ( Router ) {

	var observer = new PB.Observer();

	/**
	 * 'Proxy' method to handle context problem when we would expose observer.on instead
	 */
	function on ( type, fn, context ) {

		observer.on(type, fn, context);
	};

	/**
	 *
	 */
	function start () {

		Sandwich.assert('onhashchange' in window, 'onhashchange event not supported by browser');

		PB.$(window).on('hashchange', _execRoute);

		// Execute first route when dom is ready.
		// hopefully this will always trigger after all js is loaded
		// @todo tests
		PB.ready(_execRoute);
	};

	/**
	 *
	 */
	function _execRoute ( url ) {

		// If no url is given use the current hash
		if( typeof url !== 'string' ) {

			url = window.location.hash;
		}

		// Run router with new location
		Router.run(url);
	};

	return {

		name: 'Router.API.Hash',
		start: start,
		on: on
	};
});

return Sandwich;
});