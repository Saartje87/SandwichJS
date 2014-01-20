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