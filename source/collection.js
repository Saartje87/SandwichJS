var _Collection = {};

var Collection = PB.Class({

	construct: function () {


	}
});

/**
 * Create a model
 */
Collection.create = function ( modelName, config ) {

	if( _Collection[modelName] ) {

		Sandwich.Error.report('Model `'+modelName+'` already declared');
	}

	_Collection[modelName] = PB.Class(Collection, PB.extend({model: Model.get(modelName)}, config));
};

/**
 *
 */
Collection.factory = function ( modelName ) {

	if( !_Models[modelName] ) {

		Model.define(modelName);
	}

	return new _Models[modelName]();
};

Sandwich.Application.register('Collection', function () {

	return Collection;
});
