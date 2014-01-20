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