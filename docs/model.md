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

You want to fetch multiple models? SandwichJS will return an [collection](../collection.md) for you.
~~~js
var users = App.Model.factory('User').find();
~~~

When your model needs some customization you can define your model. Make sure when defining a model that this is done before calling Model.factory method.

~~~js
Model.define('User', {
  
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
~~~

So you also want to know when there is happing something in your model? More [model events](#events).
~~~js
var user = App.Model.factory('User');

// Listen to any change in model
user.on('change', function () {
  
  console.log('User changed');
});

user.set('firstname', 'Cubra');
// console => 'User changed'
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

## Events
* create
* read
* update
* delete
* sync
* change
* change:{{propertie name}}
