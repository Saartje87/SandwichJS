/*
<div>

	<div sw-view="Namespace.ExampleView">
		
		<h1 sw-bind="name"></h1>

		<a href="#link1">Save</a>
		<a href="#link2">Cancel</a>

	</div>

</div>

var obj = new ObservableObject({
	
	name: 'myNaammmmmeeeeee'
});

SW.Binding.set('Example.Binding', obj);

// Views are views and controllers..
SW.View.define('Namespace.ExampleView', {
	
	events: {
		
		// EventType Selector: callback
		'click a': 'onClick'
	}

	initialize: function () {
		
		// If string, uses Sandwich namespace
		// How can we do a smarter binding?
		this.listenTo('Example.Binding', 'change', this.render);
		// Or using a object/function
		this.listenTo(this.$, 'mouseover', this.handleMouseover);

		// this.$.
	},

	onClick: function ( e ) {


	}
});
*/