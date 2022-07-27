const express = require('express');
const {Board} = require('./models/board');
const {Column} = require('./models/column');
const {Task} = require('./models/task');
const {Subtask} = require('./models/subtask');

const app = express();
const port = 3000;



app.get('/', (req, res) => {
    
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
