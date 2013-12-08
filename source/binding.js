Sandwich.Module.define('Binding', ['Namespace'], function ( Namespace ) {

	// Create a namespace object got our bindings
	var NS = new Namespace(),
		observer = new PB.Observer();

	return {

		set: function ( namespace, object ) {

			NS.set(namespace, object);
		},

		get: function ( namespace ) {

			return NS.get(namespace);
		},

		on: function ( namespace, types, callback, context ) {

			var object = this.get(namespace);

			if( !object.on || typeof object.on !== 'function' ) {

				Sandwich.Error.report('Tried calling on which is no method');
			}

			object.on(types, callback, context);
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