Sandwich.Log = function () {


};

Sandwich.Error = function () {

};

Sandwich.assert = function ( a, message ) {

	if( a !== true ) {

		throw Error(message);
	}
}