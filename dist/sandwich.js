/*!
 * SandwichJS v0.0.1
 * https://github.com/Saartje87/SandwichJS
 *
 * Copyright 2013 Niek Saarberg
 * Licensed MIT
 *
 * Build date 2013-12-10 00:50
 */
(function ( name, context, definition ) {
	
	this[name] = definition(context);

})('Sandwich', this, function ( context ) {

'use strict';

var Sandwich = {};

// CODE BELOW FOR TESTING (NEW PBJS CLASS INHERITANCE)
/**
 * Create a wrapper function that makes it possible to call the parent method
 * trough 'this.parent()'
 */
function createClassResponder ( method, parentMethod ) {

    return function () {

        this.parent = parentMethod;

        return method.apply( this, arguments );
    };
}

PB.Class = function ( parentClass, baseProto ) {

	var child, childProto, constructor,
		name, prop, parentProp, parentProto, parentConstructor;

	if( !baseProto ) {

		baseProto = parentClass;
		parentClass = null;
	}

	if( baseProto.construct || baseProto.constructor.toString().indexOf('Function()') > -1 ) {

		constructor = baseProto.construct || baseProto.constructor;
	}

	if( parentClass ) {

		parentProto = parentClass.prototype;

		if( constructor ) {

			parentConstructor = parentClass;
		} else {

			constructor = parentClass;
		}
	}

	child = constructor
		? function () { if( parentConstructor ) { this.parent = parentConstructor; }  return constructor.apply(this, arguments); }
		: function () {};
	
	childProto = child.prototype;

	// Fill our prototype
	for( name in baseProto ) {
		
		if( baseProto.hasOwnProperty(name) && name !== 'construct' ) {

			prop = baseProto[name];
			parentProp = parentClass ? parentProto[name] : null;

			if( parentProp && typeof prop === 'function' && typeof parentProp === 'function' ) {

				prop = createClassResponder(prop, parentProp);
			}

			childProto[name] = prop;
		}
	}

	PB.extend(childProto, parentProto);

	return child;
};



Sandwich.Error = {

	report: function ( msg ) {

		throw new Error(msg);
	},

	log: function ( msg ) {

		console && console.log(msg);
	}
};
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

		this.rootElement = App.rootElement = PB.$(options.rootElement || this.rootElement);

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
Sandwich.Module.define('Router', ['Route'], function ( Route ) {

	/**
	 *
	 */
	function execRoute ( url, options ) {

		var match;

		// If no url is given use the current hash
		if( typeof url !== 'string' ) {

			url = window.location.hash;
		}

		url = cleanUrl(url);

		if( match = matchRoute(url) ) {

			match.callback.apply(match.callback, match.params);
		}
	}

	/**
	 *
	 */
	function cleanUrl ( url ) {

		return url
			.replace(/^#?\!?/, '')					// Strip #!
			.replace(/^\/\/+/g, '/')				// Replace /// => /
			.replace(/^[\/|\s]+|[\/|\s]+$/g, '');	// Trim slashes and whitespaces
	}

	/**
	 *
	 */
	function matchRoute ( url ) {

		var routes = Route.all(),
			routeParams, matchedRoute,
			i = 0;

		for( ; i < routes.length; i++ ) {

			if( routeParams = routes[i].matches(url) ) {

				matchedRoute = routes[i];
				break;
			}
		}

		if( !matchedRoute ) {

			return false;
		}

		return {

			route: matchedRoute.route,
			callback: matchedRoute.callback,
			params: routeParams
		};
	}

	return {

		onStart: function () {

			if( !('onhashchange' in window) ) {

				throw new Error('Browser not supported');
			}

			PB.$(window).on('hashchange', execRoute);

			// Execute first route when dom is ready (hopefully this will always trigger after all js is loaded)
			PB.ready(execRoute);
		},

		/**
		 *
		 */
		navigate: function ( url, options ) {

			// Strip the protocol + host from url
			url = url.replace(window.location.protocol+'//'+window.location.hostname, '');

			// Execute request silently
			if( options && options.silent ) {
				
				return execRoute(url, options);
			}

			window.location.hash = '!'+cleanUrl(url);
		},

		/**
		 *
		 */
		when: function ( route, callback ) {

			if( typeof route !== 'string' ) {

				Sandwich.Error.report('Router.when::First argument must be a string');
			}

			if( typeof callback !== 'function' ) {

				Sandwich.Error.report('Router.when::Second argument must be a function');
			}

			route = cleanUrl(route);

			Route.add(route, callback);
		}
	}
});

Sandwich.Application.register('Router', function () {

	return Sandwich.Module.getInstance('Router');
});
Sandwich.Module.define('Route', function () {

	var routes = [];

	/**
	 *
	 */
	function compile ( route ) {

		var regex = '^',
			chr = '',
			groupName = '',
			i = 0,
			length = route.length;

		for( ; i < length; i++ ) {

			chr = route[i];

			switch ( chr ) {

				case '/':
					regex += '\\/';
					break;

				case ':':
					i = skip(i, route);
					regex += '([a-z0-9\.\\s_-]+)';
					break;

				case '*':
					i = skip(i, route);
					regex += '(.*)';
					break;

				default:
					regex += chr;
					break;
			}
		}

		regex += '$';

		regex = new RegExp(regex, 'i');

		return function ( url ) {

			var result = url.match(regex);

			return result ? Array.prototype.slice.call(result, 1) : null;
		};
	};

	/**
	 *
	 */
	function skip ( i, route ) {

		for( i += 1; i < route.length; i++ ) {

			if( !(/[a-zA-Z0-9]/).test(route[i]) ) {

				return i - 1;
			}
		}

		return i;
	};

	return {

		/**
		 *
		 */
		add: function ( route, callback ) {

			routes.unshift({

				route: route,
				matches: compile(route),
				callback: callback
			});
		},

		/**
		 *
		 */
		all: function () {

			return routes;
		}
	};
});
var _Models = {};

// Declare Sync object
Sandwich.Sync = {};

var Model = PB.Class(PB.Observer, {

	name: null,

	idAttribute: 'id',

	sync: 'RESTful',

	construct: function () {

		this.parent();

		this.attributes = {};

		// Client-id
		this.cid = guid();
	},

	/**
	 *
	 */
	find: function () {

		var options = {};

		this._sync('search', this, options);

		return Collection.factory('User');
	},

	/**
	 * 
	 */
	findOne: function ( id ) {

		// Should be so we return a new object, read should also check if model already exsting in memory
		return Model.factory(this.name).set('id', id).fetch();
	},

	_sync: function ( method, options ) {

		var sync = Sandwich.Sync[this.sync];

		if( !sync ) {

			Sandwich.Error.report('No valid sync given, '+this.sync);
		}

		sync('read', this, options);
	},

	get: function ( key ) {

		return this.attributes[key];
	},

	has: function ( key ) {

		return this.get(key) !== undefined;
	},

	set: function ( key, value, options ) {

		if( value === this.get(key) ) {

			return this;
		}

		options || (options = {});

		this.attributes[key] = value;

		if( typeof this[key] === 'function' ) {

			this[key](key, value);
		}

		if( !options.silent ) {

			this.emit('change');
			this.emit('change:'+key);
		}

		return this;
	},

	setData: function ( data, options ) {

		var key;

		options || (options = {});

		options.silent = true;

		for( key in data ) {

			if( data.hasOwnProperty(key) ) {

				this.set(key, data[key], options);
			}
		}

		this.emit('change');

		return this;
	},

	unset: function ( key ) {

		delete this.attributes[key];
	},

	clear: function () {},

	fetch: function () {

		this._sync('read');

		return this;
	},

	save: function () {},

	destroy: function () {},

	url: function () {

		if( this.isNew() ) {

			return '/'+this.name+'/rest/';
		}

		return '/'+this.name+'/rest/'+this.get(this.idAttribute);
	},

	// Parse response
	parse: function ( data ) {

		this.setData(data);

		this.onDataResponseCallback && this.onDataResponseCallback();
	},

	clone: function () {},

	isNew: function () {

		return !this.has(this.idAttribute);
	},

	isValid: function () {},

	/**
	 * Return a shallow copy of attributes
	 */
	getJSON: function () {

		return PB.overwrite({}, this.attributes);
	},

	onDataResponse: function ( callback ) {

		this.onDataResponseCallback = callback;
	}
});

/**
 * Create a model
 */
Model.define = function ( modelName, config ) {

	if( _Models[modelName] ) {

		Sandwich.Error.report('Model `'+modelName+'` already declared');
	}

	_Models[modelName] = PB.Class(Model, PB.extend({name: modelName}, config));
};

/**
 * Get model
 */
Model.get = function ( modelName ) {

	if( !_Models[modelName] ) {

		Model.define(modelName);
	}

	return _Models[modelName];
};

/**
 *
 */
Model.factory = function ( modelName ) {

	var model = Model.get(modelName);

	return new model();
};

Sandwich.Application.register('Model', function () {

	return Model;
});

// Tmp location
function s4 () {

	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1);
};

function guid () {

	return s4()+s4()+'-'+s4()+'-'+s4()+'-'+s4()+'-'+s4()+s4()+s4();
};
var _Collection = {};

var Collection = PB.Class(PB.Observer, {

	length: 0,

	construct: function () {

		this.parent();
	},

	set: function ( data ) {

		if( PB.type(data) !== 'array' ) {

			Sandwich.Error.report('Data object is not an array `'+PB.type(data)+'` given');
			return this;
		}

		this.data = data;
		this.length = this.data.length;

		this.emit('all');

		return this;
	},

	getJSON: function () {

		return this.data;
	}
});

/**
 * Create a model
 */
Collection.define = function ( modelName, config ) {

	if( _Collection[modelName] ) {

		Sandwich.Error.report('Model `'+modelName+'` already declared');
	}

	_Collection[modelName] = PB.Class(Collection, PB.extend({name: modelName}, config));
};

/**
 * Get model
 */
Collection.get = function ( modelName ) {

	if( !_Collection[modelName] ) {

		Collection.define(modelName);
	}

	return _Collection[modelName];
};

/**
 *
 */
Collection.factory = function ( modelName ) {

	var collection = Collection.get(modelName);

	return new collection();
};

Sandwich.Application.register('Collection', function () {

	return Collection;
});

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
// Map from CRUD to HTTP for our default `Backbone.sync` implementation.
var methodMap = {
	'create': 'POST',
	'update': 'PUT',
	//'patch': 'PATCH',
	'delete': 'DELETE',
	'read': 'GET'
};

Sandwich.Sync.RESTful = function ( method, model, options ) {

	var callback,
		params = {

			url: model.url(),
			method: methodMap[method]
		};

	if( params.method === 'GET' ) {

		// We should call model.parse with response
		callback = model.parse.bind(model);
	} else {

		callback = function () {};
	}

	new PB.Request(params).on('end', function ( t, code ) {

		if( !t || !t.responseJSON ) {

			Sandwich.Error.report('Unexpected JSON response', t.responseText);
			return;
		}

		callback(t.responseJSON);
	}).send();
};
Sandwich.Module.define('BaseView', function () {

	return PB.Class({

		construct: function ( $, options, bindings ) {

			this.$ = $;
			this.options = options;

			PB.overwrite(this, bindings);

			this.initialize();

			if( this.events ) {

				this._bindEvents();
			}
		},

		initialize: function () {},

		_destruct: function () {

			this.$.remove();
			this.$ = null;
		},

		_bindEvents: function () {

			var events = this.events,
				key,
				parts,
				type,
				selector,
				methodName;

			for( key in events ) {

				if( events.hasOwnProperty(key) ) {

					parts = key.split(' ');
					type = parts.shift();
					selector = parts.join(' ');
					methodName = events[key];

					if( typeof this[methodName] !== 'function' ) {

						Sandwich.Error.report('View has no method called `'+methodName+'` with key `'+key+'`');
						continue;
					}

					this.$.on(type, selector, this[methodName], this);
				}
			}
		}
	});
});

Sandwich.Module.define('View', ['BaseView'], function ( BaseView ) {

	var views = {},
		cache = [];

	/**
	 *
	 */
	function getCachedView ( viewName, viewElement ) {

		var i = 0;

		for( ; i < cache.length; i++ ) {

			if( cache[i].element[0] === viewElement[0] && cache[i].viewName === viewName ) {

				return cache[i];
			}
		}

		return false;
	};

	return {

		/**
		 *
		 */
		define: function ( viewName, view ) {

			if( views[viewName] ) {

				Sandwich.Error.report('Sandwich.View.define::`'+viewName+'` already defined');
			}

			views[viewName] = PB.Class(BaseView, view);
		},

		/**
		 * 
		 */
		render: function () {

			var viewElements = Sandwich.Application.rootElement.find('[sw-view]'),
				viewElement, viewName, entry, view,
				i = 0,
				viewsInUse = [];

			for( ; i < viewElements.length; i++ ) {

				viewElement = viewElements.get(i);
				viewName = viewElement.getAttr('sw-view');

				if( !views[viewName] ) {

					Sandwich.Error.report('Sandwich.View.render::`'+viewName+'` not defined');
				}

				if( entry = getCachedView(viewName, viewElement) ) {

					viewsInUse.push(entry);
					continue;
				}

				entry = {

					view: new views[viewName](viewElement),
					viewName: viewName,
					element: viewElement
				};

				cache.push(entry);

				viewsInUse.push(entry);

				// Render view
				entry.view.render && entry.view.render();
			}

			for( i = 0; i < cache.length; i++ ) {

				if( viewsInUse.indexOf(cache[i]) === -1 ) {

					cache[i].view.destroy && cache[i].view.destroy();
				}
			}

			cache = viewsInUse;
		}
	}
});

Sandwich.Application.register('View', function () {

	return Sandwich.Module.getInstance('View');
});


return Sandwich;
});

