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