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