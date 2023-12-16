const mongoose = require('mongoose')

// mongoose.connect('mongodb+srv://naeemintolap12:naeemintolap12@cluster0.zpe6ylm.mongodb.net/School?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://user834016:user834016@vvit.gkwddtz.mongodb.net/SchoolPractice?retryWrites=true&w=majority')
    .then(() => { console.log('BD Connected') })
    .catch((err) => { console.log('error', err) })