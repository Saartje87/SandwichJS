var _Modules = {};

Sandwich.Module = {

	/**
	 * Define module
	 *
	 * @param {String} Module name
	 * @param {Array} *optional Dependencies
	 * @param {Function} Module definition
	 * @return {Void}
	 * @throws {Error} For wrong arguments or module already exists
	 */
	define: function ( moduleName, dependecies, module ) {

		if( !module ) {

			module = dependecies;
			dependecies = null;
		}

		if( typeof moduleName !== 'string' ) {

			// Sandwich.assert(moduleName !== 'string', 'Sandwich.Module.define::moduleName must be a string')
			Sandwich.Error.report('Sandwich.Module.define::moduleName must be a string');
		}

		if( typeof module !== 'function' ) {

			Sandwich.Error.report('Sandwich.Module.define::module definition must be function');
		}

		if( _Modules[moduleName] ) {

			Sandwich.Error.report('Sandwich.Module.define::module `'+moduleName+'` already declared');
		}

		_Modules[moduleName] = {

			dependecies: dependecies,
			module: module,
			instance: null
		}
	},

	/**
	 * Get instance of module.
	 *
	 * Note. Modules are used as singletons.
	 *
	 * @param {String} Module name
	 * @return {Object} Module
	 * @throws {Error} if module not found
	 */
	getInstance: function ( moduleName ) {

		var dependencies = [],
			module;

		if( !(moduleName in _Modules) ) {

			Sandwich.Error.report('Sandwich.Module.getInstance::module `'+moduleName+'` not found');
		}

		module = _Modules[moduleName];

		if( module.instance ) {

			return module.instance;
		}

		module.dependecies && module.dependecies.forEach(function ( moduleName ) {

			dependencies.push(this.getInstance(moduleName));
		}, this);

		module.instance = module.module.apply(null, dependencies);

		if( typeof module.instance.onStart === 'function' ) {

			module.instance.onStart();
		}

		return module.instance;
	},

	/**
	 * Get all modules
	 *
	 * @return {Array} of modules
	 */
	getModules: function () {

		return _Modules;
	}
};
