const express = require('express');
const {Board} = require('./models/board');
const {Column} = require('./models/column');
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
        subtasks:  subTasksList,
        status: 'Todo'
    });

    const task2 = new Task({
        title: 'Read a book',
        description: 'read Sense and Sensibility',
        subtasks:  subTasksList,
        status: 'Doing'
    });

    const tasksList = [];
    tasksList.push(task);
    tasksList.push(task2);

    
    const column = new Column({
        title: 'this is a column',
        tasks: tasksList,
        numOfTasks: tasksList.length

    });

    const columnsList = [];
    columnsList.push(column);

    console.log(column);
    console.log(column.tasks);
    console.log(column.tasks[0].subtasks);

    const board = new Board({
        title: 'This is a board',
        columns: columnsList
    });

    console.log(board);
    
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
