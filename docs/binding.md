# Bindings

Bindings are meant as a bridge between code components. A special binding feature is that it will try look for `on` method on the given object to register a callback when the object triggers an change event and then emits a change events of his own. This will gave a much more flexible approch of changing data between views, routes and modules.

Mhh Binding could also be less flexible, but a lot easier to destoy it clearing attached event listeners..

Setup binding

~~~js
var App = Sandwich.Application.create();

// A good approach for naming is using namespaces.
App.Binding.set('User.newUser', App.Model.factory('User'));
~~~

Now that we binded a model we also want to retrieve it.

~~~js
var user = App.Binding.get('User.newUser');
// or
var user = App.Binding.get('User').newUser;
~~~

Listen to Binding events

~~~js
App.Binding.on('User.newUser', 'change', function () {

  console.log("newUser changed!");
});
~~~
