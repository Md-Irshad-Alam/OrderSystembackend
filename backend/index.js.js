const express =require('express')
const router = require('./Routes');
const cors = require('cors');
const config =require('./Config')
const mongoose = require('mongoose');
const port = process.env.PORT || 6060;
const app = express();
app.use(express.json());
app.use(cors());

app.use('/auth',router)
// enable the static url               provide the  Rooth path 
app.use('/public/uplods', express.static('Public/uploads'))

app.listen(port, async(req, res)=>{

   await mongoose.connect(config.Connect_db_URL)
   .then((responce)=>{
    console.log("server is connected with databse ")
   }).catch((error)=>{
    console.log(`server connection is faild  ${error}` )
   })
      
   
    
    console.log("server is live on the http://localhost:8080");
})



