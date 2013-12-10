# Collection

Collections exists of multiple [models](/docs/model.md).

Creating a collection. A model name must always be provided when creating a collection.

~~~js
var App = Sandwich.Application.create();

var books = App.Collection.factory('Book');
~~~

## Events

Collection objects do have some events of there own, but also listens to change events of any model stored in it.

@todo What arguments do events have

### add

When one or more models are added.

~~~js
books.on('add', function () {
  
  // Model added
});

books.add(App.Model.factory('Book').findOne(1));
~~~

### remove

When one or more models are removed.

~~~js
books.on('remove', function () {
  
  // Model removed
});

books.remove(books.at(1));
// or
books.removeAt(0);
~~~

### change

When data of one of the models changed.

~~~js
books.on('change', function () {
  
  // Model added
});

books.at(0).set('title', 'My book');
~~~

## Properties
* model: [Sandwich.Model](/docs/model.md)

## methods
* construct
* toJSON
* save


* _sync
* add
* remove
* get
* at
* fetch
* parse

