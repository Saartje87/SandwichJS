var _Modules = {};

Sandwich.Module = {

	/**
	 *
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

			Sandwich.Error.report('Sandwich.Module.define::module declaration must be an object');
		}

		_Modules[moduleName] = {

			dependecies: dependecies,
			module: module,
			instance: null
		}
	},

	/**
	 * 
	 */
	start: function ( moduleName ) {

		var dependencies = [],
			module;

		if( !(moduleName in _Modules) ) {

			Sandwich.Error.report('Sandwich.Module.start::module `'+moduleName+'` not found');
		}

		module = _Modules[moduleName];

		if( module.instance ) {

			return module.instance;
		}

		module.dependecies && module.dependecies.forEach(function ( moduleName ) {

			dependencies.push(Sandwich.Module.start(moduleName));
		});

		module.instance = module.module.apply(null, dependencies);

		if( typeof module.instance.onStart === 'function' ) {

			module.instance.onStart();
		}

		return module.instance;
	},

	/**
	 *
	 */
	getModules: function () {

		return _Modules;
	}
};
