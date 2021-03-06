const express = require('express');
const app = express();
const api = require('./routes/api')

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    next()
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', api)

const port = 8888
app.listen(port, function(){
    console.log(`Running server on port ${port}`)
})
