Sandwich.Module.define('Namespace', function () {

	return PB.Class({

		construct: function () {

			this.namespace = {};
		},

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

		get: function ( namespace ) {

			var parts = namespace.split('.'),
				ns = this.namespace,
				i = 0;

			for( ; i < parts.length; i++ ) {

				if( !ns[parts[i]] ) {

					Sandwich.Error.report('Namespace not defined!');
				}

				ns = ns[parts[i]];
			}

			return ns;
		}
	});
});

Sandwich.Module.define('Binding', ['Namespace'], function ( Namespace ) {

	// Create a namespace object got our bindings
	var NS = new Namespace();

	return {

		set: function ( namespace, object ) {

			NS.set(namespace, object);
		},

		get: function ( namespace ) {

			return NS.get(namespace);
		},

		on: function () {


		},

		off: function () {


		}

		/*emit: function () {


		}*/
	};
});

Sandwich.Application.register('Binding', function () {

	return Sandwich.Module.getInstance('Binding');
});