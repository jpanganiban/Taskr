var express = require('express');
var app = express();
var _ = require('underscore');

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use('/static', express.static(__dirname + '/static'));
  app.use(express.bodyParser());
});


var tasks = [
  {id: 1, name: 'Do this', done: true},
  {id: 2, name: 'Another Task', done: false}
]


app.get('/', function(req, res) {
  res.render('index', {
    tasks: JSON.stringify(tasks)
  });
});

app.get('/tasks', function(req,res) {
});

app.post('/tasks', function(req, res) {
  var task = req.body;
  task['id'] = tasks.length + 1;
  tasks.push(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.send(task);
});

app.delete('/tasks/:task_id', function(req, res) {
});

app.put('/tasks/:task_id', function(req, res) {
  var task = _.find(tasks, function(task) {
    return task.id.toString() === (req.params.task_id);
  });
  task.done = req.body.done;
  task.name = req.body.name;
  res.setHeader('Content-Type', 'application/json');
  res.send(task);
});


app.listen('3000', function() {
  console.log('application running on localhost:3000');
});
