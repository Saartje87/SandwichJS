# Creating an application

The line every application needs! To start your application, run the following code.

~~~js
var App = Sandwich.Application.create();
~~~

At this point we can start added routes trough the [App.Router](/docs/router.md) object, start creating [App.Model](/docs/model.md) or we could even start rendering [Views](/docs/view.md).

# Register module

At some point you may want to overide or add modules. Every module registered trough `Sandwich.Application.register` gets there special place in the return value of `Sandwich.Application.create()`.

For example
~~~js
Sandwich.Application.register('MyModule', function () {
  
  return PB.Class({
    
    construct: function () {
      
      console.log('Need a Sandwich');
    }
  );
});

var App = Sandwich.Application.create();

var my = new App.MyModule();
~~~
