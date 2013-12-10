# Model

Models do not need a declaration to retrieve an instance.
~~~js
var App = Sandwich.Application.create();

var user = App.Model.factory('User');
~~~

You know the model id? Lets try to find this entry. Our `findOne` method will return a model when the entry is found.
~~~js
var user = App.Model.factory('User').findOne(1);
~~~

You want to fetch multiple models? SandwichJS will return an [collection](/docs/collection.md) for you.
~~~js
var users = App.Model.factory('User').find();
~~~

When your model needs some customization you can define a model.<br/>
Make sure when defining a model that this is done before calling `Model.factory` with the same model name because our factory method will define a model otherwise. This will speed up our next factory call.

~~~js
App.Model.define('SpaceMonkey', {
  
  construct: function () {
    
    // Don't forget to call the parent constructor
    this.parent.apply(this, arguments);
    
    // Add your own code
  },
  
  // Overwrite url method
  url: function () {
    
    var url = '/'+this.name+'/secret/rest/';
    
    if( this.isNew() ) {
      
      return url;
    }
    
    return url+this.get(this.idAttribute);
  }
});

var myMonkey = App.Model.factory('SpaceMonkey').
~~~

Working with (custom) model attributes.

~~~js
App.Model.define('Band', {
  
  // Getter, model.get('date_started');
  date_started: function () {
    
   return new Date().getFullYear() -this.get('years_together');
  }
});
~~~

Adding model 'relations'. SandwichJS has no ORM or so whatever.
Mapped atributes do always exist. So when creating a new model attributes mapped as a model/collection are created.

~~~js
App.Model.define('Band', {
  
  map: {
    
    // Map property member to Collection
    'member: 'Collection.Member',
    // Map property to Model
    'producer': 'Model.Producer
  }
});
~~~

## Events

You may want to know when something changes or happens in our object. To know this we can attach events listeners.

@todo What arguments do events have

### change

Triggered when any attribute changes in our model.

~~~js
// Create new model
var cake = App.Model.factory('Cake');

cake.on('change', function () {
  
  // Something changes
});

cake.set('sugar', '300 ouns');
// Change event fired
~~~

### change:attribute_name

Triggered when given attribute changes in our model.

~~~js
// Create new model
var cake = App.Model.factory('Cake');

cake.on('change:flower', function () {
  
  // Flower attribute changed
});

user.set('flower', '.3 ouns');
// 'change:flower' event triggered

user.set('sugar', '100 ouns');
// 'change:flower' not event triggered
~~~

### sync

Triggered when data has successfully synced. For example to a server.

~~~js
// Find cake wit ID 1
var cake = App.Model.factory('Cake').findOne(1);

cake.on('sync', function () {
  
  // Sync done
});
~~~

### fetch

Triggered when data is fetched. This could be when data is fetched from server.
There are a few cases when you want to use this event, the change event would be suffecient in most cases.

~~~js
// Find cake wit ID 1
var cake = App.Model.factory('Cake').findOne(1);

cake.on('fetch', function () {
  
  // Done fetching
});
~~~

## Properties
* idAttribute: String
* attributes: Object
* cid: String Client-ID


## methods
* initialize
* toJSON
* sync
* get
* has
* set
* unset
* clear
* fetch
* save
* destroy
* url => Get url to request
* parse => Parse response
* clone
* isNew
* isValid

Methods inherited from PB.Observer
* on
* off
* emit
