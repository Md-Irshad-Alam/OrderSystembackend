const express =require('express')
const router = require('./Routes');
const cors = require('cors');
const config =require('./Config')
const mongoose = require('mongoose');


const app = express();
app.use(express.json());
app.use(cors());



app.use('/auth',router)

app.listen(6060, async(req, res)=>{

   await mongoose.connect(config.Connect_db_URL)
   .then((responce)=>{
    console.log("server is connected with databse ")
   }).catch((error)=>{
    console.log(`server connection is faild  ${error}` )
   })
      
   
    
    console.log("server is live on the http://localhost:8080");
})



