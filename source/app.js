/*!
 * SandwichJS v0.0.1
 * https://github.com/Saartje87/SandwichJS
 *
 * Copyright 2014 Niek Saarberg
 * Licensed MIT
 *
 * Build date 2014-xxxxxxxxx
 */
(function ( name, context, definition ) {
	
	this[name] = definition(context);

})('Sandwich', this, function ( context ) {

'use strict';

var Sandwich = {};

require('source/utils/main');
require('source/module');

require('source/application/application');
require('source/router/main');

return Sandwich;
});