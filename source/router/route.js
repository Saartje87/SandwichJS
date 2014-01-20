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