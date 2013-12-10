# Collection

Collections exists of multiple [models](/docs/model.md).

Creating a collection. A model name must always be provided when creating a collection.

~~~js
var App = Sandwich.Application.create();

var books = App.Collection.factory('Book');
~~~

## Events

Collection objects do have some events of there own, but also listens to change events of any model stored in it.

### add

When one or more models are added.

### remove

When one or more models are removed.

### change

When a models data changed.

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

