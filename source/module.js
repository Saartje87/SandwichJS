Sandwich.module = function ( namespace, dependencies, module ) {

	if( !module ) {

		module = dependencies;
		dependencies = null;
	} else {

		// Should be a validation over dependencies
		dependencies = dependencies.map(Sandwich.getNS);
	}

	// 
	if( namespace && !module ) {

		return Sandwich.getNS(namespace);
	}

	if( typeof namespace !== 'string' ) {

		// Sandwich.assert(moduleName !== 'string', 'Sandwich.Module.define::moduleName must be a string')
		console.warn('Sandwich.module::namespace must be a string');
	}

	if( typeof module !== 'function' ) {

		console.warn('Sandwich.module::module definition must be function');
	}

	if( Sandwich.getNS(namespace) ) {

		console.warn('Sandwich.module::module `'+namespace+'` already declared');
		throw Error();
	}

	Sandwich.setNS(namespace, module.apply(null, dependencies || []));
};