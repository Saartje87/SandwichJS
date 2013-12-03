# Creating an application

~~~js
window.App = Sandwich.Application.create();
~~~

# Register module
~~~js
Sandwich.Application.register('ModuleName', Module);

Sandwich.Application.register('ModuleName', function () {
  
  return new Singleton();
});
~~~
