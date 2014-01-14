var _Models = {};

// Declare Sync object
Sandwich.Sync = {};

var Model = PB.Class(PB.Observer, {

	name: null,

	idAttribute: 'id',

	// @todo: rename sync to store
	sync: 'RESTful',

	/**
	 * Initialize model
	 */
	construct: function () {

		this.parent();

		this.attributes = {};

		// Client-id
		this.cid = guid();
	},

	/**
	 * Find by object of GET params
	 *
	 * @return {Collection}
	 */
	find: function () {

		var options = {};

		this._sync('search', this, options);

		return Collection.factory('User');
	},

	/**
	 * Find one model 
	 *
	 * @return {Model}
	 */
	findOne: function ( id ) {

		// @todo cache models in memory, so changes are always on the same model
		// We should consider cases where this is not wanted. So we implement this later
		// if needed.

		//  Model is empty, use current model
		if( !Object.keys(this.attributes).length ) {

			return this.set('id', id).fetch();
		}

		// Create new model
		return Model.factory(this.name).set('id', id).fetch();
	},

	/**
	 * Sync model to storage
	 */
	_sync: function ( method, options ) {

		var sync = Sandwich.Sync[this.sync];

		if( !sync ) {

			Sandwich.Error.report('No valid sync given, '+this.sync);
		}

		sync(method, this, options);
	},

	/**
	 * Get model attribute(s)
	 *
	 * @param {String} *optional 
	 * @return {Object} this
	 */
	get: function ( key ) {

		if( key === undefined ) {

			// Should we return a clone here? Pretty hard with models as childs etc..
			return this.attributes;
		}

		return this.attributes[key];
	},

	/**
	 * Check whether the model has given attribute
	 *
	 * @param {String} attribute name
	 * @return {Boolean}
	 */
	has: function ( key ) {

		return this.get(key) !== undefined;
	},

	/**
	 * Set an attribute or an object of attributes.
	 *
	 * @param {String/Object}
	 * @param {Mixed}
	 * @param {Object} *optional
	 * @return {Object} this
	 */
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

	/**
	 * Remove attribute
	 *
	 * @param {String} attribute name
	 * @return {Object} this
	 */
	unset: function ( key ) {

		delete this.attributes[key];
	},

	clear: function () {},

	/**
	 * Fetch data from given sync (default to RESTful)
	 *
	 * @return {Object} this
	 */
	fetch: function () {

		this._sync('read');

		return this;
	},

	save: function () {},

	// Renamed from destroy
	remove: function () {},

	/**
	 * Build url for rest call
	 *
	 * @return {String}
	 */
	url: function () {

		if( this.isNew() ) {

			return '/'+this.name+'/rest/';
		}

		return '/'+this.name+'/rest/'+this.get(this.idAttribute);
	},

	/**
	 * Parse response (called after _sync)
	 */
	parse: function ( data ) {

		this.setData(data);

		// this.onDataResponseCallback && this.onDataResponseCallback();
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
	}

	// onDataResponse: function ( callback ) {

	// 	this.onDataResponseCallback = callback;
	// }
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