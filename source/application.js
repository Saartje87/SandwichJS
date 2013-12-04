var _AppInit = false;

Sandwich.Application = {

	rootElement: 'body',

	_modules: {},

	/**
	 * Create out application!
	 */
	create: function () {

		var key,
			app = Sandwich.Application,
			modules = app._modules,
			App = {};

		if( _AppInit ) {

			return Sandwich.Error.report('Sandwich.Application.create already initialized');
		}

		App.rootElement = PB.$(app.rootElement);

		for( key in modules ) {

			if( modules.hasOwnProperty(key) ) {

				App[key] = modules[key]();
			}
		}

		_AppInit = true;

		return App;
	},

	/**
	 * 
	 */
	define: function ( name, callback ) {

		Sandwich.Application._modules[name] = callback;
	}
};