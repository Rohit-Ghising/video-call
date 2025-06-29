const express = require('express')
const {Server}= require("socket.io")
const bodyParser = require("body-parser")

const io = new Server()
const app = express()

app.use(bodyParser.json())
io.on('connection',(socket)=>{})

app.listen(8000,()=> console.log("Server is runing on port 8000"))
io.listen(8001,()=> console.log("Server is runing on port 8001"))