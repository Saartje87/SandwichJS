Sandwich.Module.define('Router', ['Route'], function ( Route ) {

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

		var routes = Route.all(),
			routeParams, matchedRoute,
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

	return {

		onStart: function () {

			if( !('onhashchange' in window) ) {

				throw new Error('Browser not supported');
			}

			PB.$(window).on('hashchange', execRoute);

			// Execute first route when dom is ready (hopefully this will always trigger after all js is loaded)
			PB.ready(execRoute);
		},

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

			Route.add(route, callback);
		}
	}
});

Sandwich.Application.register('Router', function () {

	return Sandwich.Module.getInstance('Router');
});