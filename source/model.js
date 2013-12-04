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