# Modules

Module are a way to store code and make use of privates / publics. Modules work like a singleton, there meant to be initialized once.

## Defining an module

~~~js
var App = Sandwich.Application.create();

App.Module.define('User', function () {

  function privateMethod () {
    
    return 'UserString';
  }

  return {
    
    publicMethod: function () {
      
      return privateMethod();
    }
  };
});
~~~

## Importing modules

~~~js
App.Module.define('Visitor', ['User'], function ( user ) {

  return {
    
    publicMethod: function () {
      
      return user.publicMethod();
    }
  };
});
~~~

## Accessing module

~~~js
var visitorModule = App.Module.getInstance('Visitor');

visitorModule.publicMethod();
~~~
