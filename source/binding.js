Sandwich.Module.define('Binding', ['Namespace'], function ( Namespace ) {

	// Create a namespace object got our bindings
	var NS = new Namespace(),
		observer = new PB.Observer();

	/**
	 *
	 */
	function copyListeners ( object, listeners ) {

		var type;

		for( type in listeners ) {

			if( listeners.hasOwnProperty(type) ) {

				listeners[type].forEach(function ( obj ) {

					object.on(type, obj.fn, obj.context);
				});
			}
		}
	};

	return {

		set: function ( namespace, object ) {

			var prev = this.get(namespace);

			if( prev ) {

				copyListeners(object, prev.listeners);

				// Unbind listeners
				prev.off();
			}

			NS.set(namespace, object);
		},

		get: function ( namespace ) {

			return NS.get(namespace);
		},

		on: function ( namespace, types, callback, context ) {

			var object = this.get(namespace);

			if( !object.on || typeof object.on !== 'function' ) {

				Sandwich.Error.report('Object does not have `on` method');
			}

			object.on(types, callback, context);
		},

		off: function () {


		}

		// emit: observer.emit.bind(observer)
	};
});

Sandwich.Application.register('Binding', function () {

	return Sandwich.Module.getInstance('Binding');
});