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
		return Model.factory(this.name).fetch(id);
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

	fetch: function ( id ) {

		this.set('id', id);

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
	},

	clone: function () {},

	isNew: function () {

		return !this.has(this.idAttribute);
	},

	isValid: function () {}
});

/**
 * Create a model
 */
Model.create = function ( modelName, config ) {

	if( _Models[modelName] ) {

		Sandwich.Error.report('Model `'+modelName+'` already declared');
	}

	_Models[modelName] = PB.Class(Model, PB.extend({name: modelName}, config));
};

/**
 *
 */
Model.factory = function ( modelName ) {

	if( !_Models[modelName] ) {

		Model.create(modelName);
	}

	return new _Models[modelName]();
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