# Views

First of all, views are meant to apply specific logic to parts of the html. Could listen to data changes to update it's own contents. And render small templates.

We recommend you to use an template engine like [Handlebars](http://handlebarsjs.com/) to create clean and effecient code.

// Also notice that the container must exists in dom tree. 

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
        userModule = App.Module.start('User');
        
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

Rendering views.
