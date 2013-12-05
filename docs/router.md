# Router

First of all make sure you created an [Application](/docs/application.md) instance.

~~~js
var App = Sandwich.Application.create();
~~~

After we created an [Application](/docs/application.md) instance we can start declaring routes. Note routes are not required for SandwichJS to be functional.

Declaring our first route which get triggered when the hash of the current uri is empty (# or #!).
~~~js
App.Router.when('/', function () {
  
  document.body.innerHTML = '<h1>Welcome Sandwich Lover</h1>';
});
~~~

## Dealing with route variables

Routes should work pretty straight forward, the given uri will matched against the route. When dealing with changes route variables we got two operators which should be sufficent in most situations.

### Colons

Colons match a part of the given uri and only a subset of chars `a-z 0-9 . \s _ -` so when it matches anny other char than these a selection is made.

~~~js
App.Router.when('/user/read/:id', function ( id ) {
  
  document.body.innerHTML = '<h1>Id: '+id+'</h1>';
});
~~~

### Asterisk

Asterisk will match till end of given uri.

~~~js
App.Router.when('/download/*path, function ( path ) {
  
  document.body.innerHTML = '<h1>Download: '+path+'</h1>';
});

// #!/download/path/to/file.txt
// Route matches and path is "path/to/file.txt"
~~~

# Todos

* Add 404 status support

## methods
* when
* navigate

