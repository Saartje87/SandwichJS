/*!
 * SandwichJS v0.0.1
 * https://github.com/Saartje87/SandwichJS
 *
 * Copyright 2013 Niek Saarberg
 * Licensed MIT
 *
 * Build date 2013-12-04 23:50
 */
(function ( name, context, definition ) {
	
	this[name] = definition(context);

})('Sandwich', this, function ( context ) {

'use strict';

var Sandwich = {};


Sandwich.Error = {

	report: function ( msg ) {

		throw new Error(msg);
	}
};
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

	return Sandwich.Module.start('Router');
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
					i = skipGroup(i, route);
					regex += '([a-z0-9\.\\s_-]+)';
					break;

				case '*':
					i = skipGroup(i, route);
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

var Model = function () {

	this.attributes = {};

	// Client-id
	this.cid = guid();
};

Model.create = function ( modelName, config ) {

	if( _Models[modelName] ) {

		Sandwich.Error.report('Model `'+modelName+'` already declared');
	}

	// Tmp hack
	Model.prototype.name = modelName;

	_Models[modelName] = Model;
	// _Models[modelName] = PB.Class(Model, PB.extend({model: modelName}, config));
};

Model.factory = function ( modelName ) {

	if( !_Models[modelName] ) {

		Model.create(modelName);
	}

	return new _Models[modelName]();
};

Model.prototype = {

	name: null,

	idAttribute: 'id',

	sync: 'RESTful',

	/**
	 *
	 */
	/*find: function () {

		return Collection.factory(this.model).find();
	},*/

	/**
	 * 
	 */
	findOne: function ( id ) {

		var sync = Sandwich.Sync[this.sync];

		if( !sync ) {

			Sandwich.Error.report('No valid sync given, '+this.sync);
		}

		// Should be so we return a new object, read should also check if model already exsting in memory
		// Model.factory(this.name).read(id);

		this.set('id', id);

		sync('read', this);

		return this;
	},

	get: function ( key ) {

		return this.attributes[key];
	},

	has: function ( key ) {

		return this.get(key) !== undefined;
	},

	set: function ( key, value ) {

		if( value === this.get(key) ) {

			return this;
		}

		this.attributes[key] = value;

		return this;
	},

	setData: function ( data ) {

		var key;

		for( key in data ) {

			if( data.hasOwnProperty(key) ) {

				this.set(key, data[key]);
			}
		}

		return this;
	},

	unset: function ( key ) {

		delete this.attributes[key];
	},

	clear: function () {},

	fetch: function () {},

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
	},

	clone: function () {},

	isNew: function () {

		return !this.has(this.idAttribute);
	},

	isValid: function () {}
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

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
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
return Sandwich;
});

