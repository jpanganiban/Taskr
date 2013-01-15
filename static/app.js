var BaseView = Backbone.View.extend({
  templateId: '',
  template: function(data) {
    var templateEl = $("script[type='text/html']#" + this.templateId);
    if (!templateEl) {
      throw "template " + this.templateId + " not found";
    }
    return _.template(templateEl.html())(data);
  }
});

var Task = Backbone.Model.extend({
});

var Tasks = Backbone.Collection.extend({
  model: Task,
  url: '/tasks'
});

var TaskView = BaseView.extend({
  templateId: 'task',
  events: {
    'change .done': 'finishTask',
    'change .name': 'updateTask'
  },
  setCheckbox: function() {
    if (this.model.get('done')) {
      this.$('.done').attr('checked', 'checked')
      this.$('.done').attr('disabled', 'disabled')
      this.$('div').css({textDecoration: 'line-through'});
    }
  },
  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.setCheckbox();
    return this;
  },
  updateTask: function(e) {
    var name = this.$('.name').val();
    if (name) {
      this.model.save({
        name: name
      }, {
        wait: true,
        success: _.bind(function() {
          this.render();
        }, this)
      });
    } else {
      alert('you need to enter the task name');
      this.$('.name').focus();
    }
  },
  finishTask: function(e) {
    this.model.save({
      done: true
    }, {
      wait: true,
      success: _.bind(function(model) {
        this.render();
      }, this)
    });
  }
});

var TasksView = Backbone.View.extend({
  initialize: function() {
    this.collection.on('add', this.add, this);
  },
  add: function(model) {
    var taskView = new TaskView({
      tagName: 'li',
      className: 'task',
      model: model
    });
    this.$el.append(taskView.render().el);
  },
  render: function() {
    this.collection.each(this.add, this);
    return this;
  }
});

var TaskForm = Backbone.View.extend({
  events: {
    'submit': 'createTask'
  },
  createTask: function(e) {
    e.preventDefault();
    var task = {
      name: this.$("input[name='name']").val(),
      done: false
    };
    if (task.name) {
      this.collection.create(task, {
        wait: true,
        success: _.bind(function() {
          this.$("input[type='text']").val('');
        }, this)
      });
    } else {
      alert('you need to enter the task name');
    }
  }
});

var Taskr = Backbone.View.extend({
  initialize: function(options) {
    this.tasks = options.tasks;
  },
  render: function() {
    // Initialize Tasks View
    new TasksView({
      el: '#tasks',
      collection: this.tasks
    }).render();
    // Initialize Task Form
    new TaskForm({
      el: '#tasks-form',
      collection: this.tasks
    }).render();
    return this;
  }
});
