/**
 * 
 */
Sandwich.Module.define('Namespace', function () {

	return PB.Class({

		/**
		 *
		 */
		construct: function () {

			this.namespace = {};
		},

		/**
		 *
		 */
		set: function ( namespace, data ) {

			var parts = namespace.split('.'),
				ns = this.namespace,
				name = parts.pop(),
				i = 0;

			for( ; i < parts.length; i++ ) {

				if( !ns[parts[i]] ) {

					ns[parts[i]] = {};
				}

				ns = ns[parts[i]];
			}

			ns[name] = data;
		},

		/**
		 *
		 */
		get: function ( namespace ) {

			var parts = namespace.split('.'),
				ns = this.namespace,
				i = 0;

			for( ; i < parts.length; i++ ) {

				if( !ns[parts[i]] ) {

					Sandwich.Error.log('Namespace `'+namespace+'` not found');
					return undefined;
				}

				ns = ns[parts[i]];
			}

			return ns;
		}
	});
});