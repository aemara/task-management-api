const express = require('express');
const {Task} = require('./models/task');
const {Subtask} = require('./models/subtask');

const app = express();
const port = 3000;



app.get('/', (req, res) => {
    res.send('Hello World!')
    const subTask = new Subtask({
        name: 'this is a subtask'
    });

    const subTasksList = [];
    subTasksList.push(subTask);
    console.log(subTasksList);


    const task = new Task({
        title: 'Finish the app',
        description: 'A fullstack  app for resume',
        subtasks:  subTasksList
    });

    
    console.log(task);
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
