# Views

First of all, views are meant to apply specific logic to parts of the html. Could listen to data changes to update it's own contents. And render small templates.

We recommend you to use an template engine like [Handlebars](http://handlebarsjs.com/) to create clean and effecient code.

~~~js
var App = Sandwich.Application.create();

App.View.define('Login.screen', {
  
  // Should use a precmpiled template
  template: Handlebars.compile('<form>{{#if error}{{error}}{{/if}}<input type="text" name="username">'
    +'<input type="text" name="username">'
    +'<button>Send</button></form>'),
  
  events: {
    
    'submit form': 'authenticate'
  },
  
  authenticate: function () {
    
    var formData = this.$.find('form').serializeForm(),
        userModule = App.Module.getInstance('User');
        
      if( userModule.authenticate(formdata.username, formdata.password) ) {
        
        // Refresh 'homepage'
        App.Router.navigate('/');
      } else {
        
        this.error = App.i18n('Username and/or password not correct');
        
        this.render();
      }
  },
  
  // Triggered when view is called for first time
  render: function () {
    
    this.$.setHtml(this.template(this));
  }
});
~~~

## Rendering views

~~~html
<body>
  <div sw-view="Login.screen"></div>
</body>
~~~

The default rootElement for our application is the body element (this could be specified to be other dom elements trough application init). Lets render our view.

~~~js
App.View.render();
~~~

The view `Login.screen` should now be rendered and events applied. Don't forget to call `App.View.render()` when changing dom contents.
