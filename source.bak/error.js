Sandwich.Error = {

	report: function ( msg ) {

		throw new Error(msg);
	},

	log: function ( msg ) {

		console && console.log(msg);
	}
};