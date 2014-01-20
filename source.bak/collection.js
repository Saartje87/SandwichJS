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
