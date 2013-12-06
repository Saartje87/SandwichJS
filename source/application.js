var _AppInit = false;

Sandwich.Application = {

	// From where your app operates
	rootElement: 'body',

	// List of registered modules
	_modules: {},

	/**
	 * Create out application!
	 *
	 * @param {Object} *optional options
	 * @return {Object} Application namespace
	 * @throws {Error} when application has already been created
	 */
	create: function ( options ) {

		var key,
			modules = this._modules,
			App = {};

		options || (options = {});

		if( _AppInit ) {

			return Sandwich.Error.report('Sandwich.Application.create already initialized');
		}

		App.rootElement = PB.$(options.rootElement || this.rootElement);

		// Initialize modules
		for( key in modules ) {

			if( modules.hasOwnProperty(key) ) {

				App[key] = modules[key]();
			}
		}

		_AppInit = true;

		return App;
	},

	/**
	 * Register a startup function.
	 *
	 * Regsitered functions will be triggered once when `Sandwich.Application.create()` is called.
	 *
	 * @param {String} Module name
	 * @param {Function} Module initializer
	 */
	register: function ( moduleName, module ) {

		this._modules[moduleName] = module;
	}
};