// Sandwich stores namespaces in a private object, so no setting in the global scope
var _namespaces = {};

/**
 * Set namespace
 */
Sandwich.setNS = function setNS ( namespace, data ) {

	var parts = namespace.split('.'),
		ns = _namespaces,
		name = parts.pop(),
		i = 0;

	for( ; i < parts.length; i++ ) {

		if( !ns[parts[i]] ) {

			ns[parts[i]] = {};
		}

		ns = ns[parts[i]];
	}

	ns[name] = data;
};

/**
 * Get namespace
 */
Sandwich.getNS = function getNS ( namespace ) {

	var parts = namespace.split('.'),
		ns = _namespaces,
		i = 0;

	for( ; i < parts.length; i++ ) {

		if( !ns[parts[i]] ) {

			// console.warn('Namespace `'+namespace+'` not found');
			return undefined;
		}

		ns = ns[parts[i]];
	}

	return ns;
};