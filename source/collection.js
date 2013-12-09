var _Collection = {};

var Collection = PB.Class({

	length: 0,

	construct: function () {


	},

	set: function ( data ) {

		if( !data ) {

			return false;
		}

		this.data = data;
		this.length = this.data.length;

		return true;
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
