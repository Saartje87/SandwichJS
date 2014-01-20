Sandwich.Module.define('Route', function () {

	var routes = [];

	/**
	 *
	 */
	function compile ( route ) {

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
					i = skip(i, route);
					regex += '([a-z0-9\.\\s_-]+)';
					break;

				case '*':
					i = skip(i, route);
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
	function skip ( i, route ) {

		for( i += 1; i < route.length; i++ ) {

			if( !(/[a-zA-Z0-9]/).test(route[i]) ) {

				return i - 1;
			}
		}

		return i;
	};

	return {

		/**
		 *
		 */
		add: function ( route, callback ) {

			routes.push({

				route: route,
				matches: compile(route),
				callback: callback
			});
		},

		/**
		 *
		 */
		all: function () {

			return routes;
		}
	};
});