Sandwich.Module.define('BaseView', function () {

	return PB.Class({

		construct: function ( $, options, bindings ) {

			this.$ = $;
			this.options = options;

			PB.overwrite(this, bindings);

			this.initialize();

			if( this.events ) {

				this._bindEvents();
			}
		},

		initialize: function () {},

		_destruct: function () {

			this.$.remove();
			this.$ = null;
		},

		_bindEvents: function () {

			var events = this.events,
				key,
				parts,
				type,
				selector,
				methodName;

			for( key in events ) {

				if( events.hasOwnProperty(key) ) {

					parts = key.split(' ');
					type = parts.shift();
					selector = parts.join(' ');
					methodName = events[key];

					if( typeof this[methodName] !== 'function' ) {

						Sandwich.Error.report('View has no method called `'+methodName+'` with key `'+key+'`');
						continue;
					}

					this.$.on(type, selector, this[methodName], this);
				}
			}
		}
	});
});

Sandwich.Module.define('View', ['BaseView'], function ( BaseView ) {

	var views = {},
		cache = [];

	/**
	 *
	 */
	function getCachedView ( viewName, viewElement ) {

		var i = 0;

		for( ; i < cache.length; i++ ) {

			if( cache[i].element[0] === viewElement[0] && cache[i].viewName === viewName ) {

				return cache[i];
			}
		}

		return false;
	};

	return {

		/**
		 *
		 */
		define: function ( viewName, view ) {

			if( views[viewName] ) {

				Sandwich.Error.report('Sandwich.View.define::`'+viewName+'` already defined');
			}

			views[viewName] = PB.Class(BaseView, view);
		},

		/**
		 * 
		 */
		render: function () {

			var viewElements = Sandwich.Application.rootElement.find('[sw-view]'),
				viewElement, viewName, entry, view,
				i = 0,
				viewsInUse = [];

			for( ; i < viewElements.length; i++ ) {

				viewElement = viewElements.get(i);
				viewName = viewElement.getAttr('sw-view');

				if( !views[viewName] ) {

					Sandwich.Error.report('Sandwich.View.render::`'+viewName+'` not defined');
				}

				if( entry = getCachedView(viewName, viewElement) ) {

					viewsInUse.push(entry);
					continue;
				}

				entry = {

					view: new views[viewName](viewElement),
					viewName: viewName,
					element: viewElement
				};

				cache.push(entry);

				viewsInUse.push(entry);

				// Render view
				entry.view.render && entry.view.render();
			}

			for( i = 0; i < cache.length; i++ ) {

				if( viewsInUse.indexOf(cache[i]) === -1 ) {

					cache[i].view.destroy && cache[i].view.destroy();
				}
			}

			cache = viewsInUse;
		}
	}
});

Sandwich.Application.register('View', function () {

	return Sandwich.Module.getInstance('View');
});

