import express, { Application, Request, Response } from 'express'
require("./model/index")
const  app:Application = express()
const  PORT = 3000


app.get("/",(req:Request,res:Response) =>{
res.send("Hello World")
})

app.get("/about",(req:Request,res:Response) =>{
res.send("About Page")
})

app.listen(PORT,()=> {
console.log("server is running on port",PORT)
})