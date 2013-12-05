# Model

Models do not need a declartion to retrieve an instance.
~~~js
var App = Sandwich.Application.create();

var user = App.Model.factory('User');
~~~

When your model needs some customization you can define a model but make sure you define your model before using the factory pattern.
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

## Events
* create
* read
* update
* delete
* sync
* change
* change:{{propertie name}}
