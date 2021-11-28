const express = require('express')
const app = express()
const path = require('path')
const { main } = require('./databaseFunc')

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const router = express.Router()

// to get res.body
app.use(express.json())

// chrome has some problem. It is in grave need for this bit
app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()  // one mistake took the hell out of me
})

// Chrome preflight check: It does not have HTTP ok status.
app.options('*', function (req,res) { res.sendStatus(200); });


router.get('/json/:userId', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    main({type: "fetch", userId: req.params.userId}).then((op)=>{
        if(op.isValid){
            res.statusCode = 200
            res.send({"data": op.data})
        }else{
            res.statusCode(404).send({"error": op.error})
        }
    }).catch(err=>console.log(err))
})


router.post('/submit', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    const data = req.body.current
    console.log(data)
    let modifiedArr = []
    let deletedIds = []
    data.forEach(todo =>{
        if(todo.isdeleted)
            deletedIds.push(todo._id)
        else if(todo.ischanged)
            modifiedArr.push(todo)
    })
    console.log(modifiedArr)
    console.log('deleted ids', deletedIds)
    const action = {type: "update", data: modifiedArr, deletedIds: deletedIds}
    main(action).then((op)=>{
        if(op.isValid){
            console.log(op.data)
            res.statusCode = 200
            res.send({"data": op.data})
        }else{
            res.statusCode = 404
            res.send({"error": op.error})
        }
    }).catch(err=>console.log(err))
})

router.post('/add', (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    console.log(req.body)
    const action = {type: "update", data: [req.body], deletedIds: []}
    main(action).then((op)=>{
        if(op.isValid){
            console.log(op.data)
            res.send({"data": op.data})
        }else{
            // console.log(op.error)
            res.statusCode = 404
            res.send({"error": op.error})
        }
    }).catch(err=>console.log(err))
    // res.send('Add item')
})

router.get("/home", (req, res)=>{
    res.header("Access-Control-Allow-Origin", "*")
    // res.write in http: res.send in express
    res.send('Home page')
    
})

router.all('*', (req, res)=>{
    res.status(404).send('No such file')
})

app.use(bodyParser.json());
app.use('/.netlify/functions/api', router);  // path must route to lambda
// app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

module.exports = app;
module.exports.handler = serverless(app);

// app.use(`/.netlify/functions/api`, router)
// 
// app.listen(443, ()=>{console.log('Listening: 5000')})
// module.exports = app;
// module.exports.handler = serverless(app);