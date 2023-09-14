const Users =require('../models/user')
const config = require('../Config')
const jwt = require('jsonwebtoken')
let generateToken = (user)=>{
    let {_id, name, email} = user;
    return jwt.sign({
        _id, name, email
    }, config.Secret_key)
}
const register = async(req,res)=>{
    let user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        
    })
    user = await user.save();
    
    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
}

const login = async(req, res) => {
    try {
    
        const user  = await Users.findOne({email : req.body.email});

        if (!user) return res.status(404).send({message: "Invalid Credentials"});

        const match = user.checkPassword(req.body.password);

        if (!match) return res.status(404).send({message: "Invalid password"});


        const token = generateToken(user);

        return res.status(200).send({token: token});

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