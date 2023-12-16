const express = require('express');
const cors = require('cors');
require('./db/db');


const app = express();

app.use(express.json());
app.use(cors());

const school = require('./routes/school.route')
const teachStu = require('./routes/teacherStudent');
const active = require('./routes/activeRoute');
app.use('/school',school);
app.use('/teachStu',teachStu);
app.use('/account',active);




app.listen(8001, ()=>{
    console.log('listening on 8001')
})