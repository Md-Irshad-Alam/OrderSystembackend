const Users =require('../models/user')
const config = require('../Config')
const jwt = require('jsonwebtoken')
let generateToken = (user)=>{
    let {_id, name, email} = user;
    return jwt.sign({
        _id, name, email
    }, config.Secret_key)
}
const IsvalidateEmail = (email)=>{
    const RegexEmil = /^[^\s@]+@gmail\.com$/
    const Isemailvalid = RegexEmil.test(email)
    return Isemailvalid;
}
const register = async (req, res) => {
        try {
          const { email } = req.body;

         if( IsvalidateEmail(email)){
            let user = await Users.findOne({ email });
      
          if (user) {
            return res.send({ error: "User email already registered" });
          } else {
            const userData = {
              ...req.body,
             
            };
            user = await Users.create(userData);
            return res.status(200).send({data: user });
          }
         }else{
            res.send('Incorrect email formate,  please provide correct email')
         }
          
        } catch (error) {
          console.log(error);
          return res.status(400).send({ error });
        }
      };

const login = async(req, res) => {
    try {
    
        if(IsvalidateEmail(req.body.email)){
            const user  = await Users.findOne({email : req.body.email});

            if (!user) return res.status(404).send({message: "Invalid Credentials"});
    
            const match = user.checkPassword(req.body.password);
    
            if (!match) return res.status(404).send({message: "Invalid password"});
    
    
            const token = generateToken(user);
    
            return res.status(200).send({token: token});
        }else{
            res.send('Incorrect email formate,  please provide correct email')
        }
        

    } catch (error) {
        return res.status(500).send(error.message);
    }
}

const userCount = async(req , res)=>{
    const count = await Users.countDocuments((count)=> count)
    if(!count){
        res.status(500).json({success:false})
    }
    res.send({userCount:count})
}
async function getLoggedInUser(req, res) {
    try {
        const user = req.user;

        return res.send({
            data: user
        })

    } catch(err) {
        return res.status(500).send({
            error: 'Something went wrong'
        })
    }
}

const updateUsers = async(req, res)=>{
    const order = await Users.findByIdAndUpdate(
        req.params.id,
        {
            isAdmin: true,
        },{new:true}
    )
    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
}



module.exports={
    login,
    register,
    userCount,
    getLoggedInUser,
    updateUsers
}