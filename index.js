const express = require('express')
const app = express()
const port = 8000
const mime = require('mime-types');
const path = require('path')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');  

const urlencodedParser = bodyParser.urlencoded({ extended: false })

const setHeaders = function (req, res, next) {
    const filePath = path.join(__dirname, 'public', req.path);
    const mimeType = mime.lookup(filePath);
    if (mimeType) {
        res.type(mimeType);
    }
    res.set('X-Content-Type-Options', 'nosniff')
    next()
  }
app.use(setHeaders)
app.use(cookieParser());
app.use('/public', express.static('public'));

app.get('/visit-counter', (req, res) => {
    if(req.headers.cookie == undefined){
        res.cookie('Visits',1,{maxAge: 360000})
    }
    else{
        splitCook = req.headers.cookie.split('=')
        cookValueStr = splitCook[1]
        cookValueInt = Number.parseInt(cookValueStr) + 1
        res.cookie('Visits', cookValueInt,{maxAge: 360000})
    }
    res.sendFile(path.join(__dirname, 'public', 'visit-counter.html'));
})

app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);
    res.sendFile(filePath);
})

app.post('/make-post', (req, res) => {  
    // Do some DB stuff in here
    res.send("POST Request Called")
 })  

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})