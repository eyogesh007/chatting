const express=require('express');
const app=express();
const mongoose=require('mongoose');
const Registerr=require('./regschema.js');
const jwt=require('jsonwebtoken');
const checktoken=require('./checktoken');
//const msgschema=require('./msgschema.js');
const cors = require('cors');
app.use(cors({
    origin: '*'
}))

app.use(express.json());


let msgschemas=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Registerr'
    },
    username:{
        type:String,
        required:true
    },
    dateandtime:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

})



mongoose.connect("mongodb+srv://yogesh:yoge111@cluster0.grmrsyh.mongodb.net/?retryWrites=true&w=majority").then(()=>console.log("db connected"))
var db = mongoose.connection;

app.get('/',(req,res)=>{
    res.send('chat app')
})




app.post('/register',async(req,res)=>{
    const {username,password,confirmpassword} = req.body;
    console.log(req.body)
    let exist = await Registerr.findOne({username})
    if(exist){
        return res.send('User Already Exist')
    }
    if(password !== confirmpassword){
        return res.send('Passwords are not matching');
    }
    let newUser = new Registerr({
        username,
        password,
        confirmpassword
    })
    await newUser.save();
    res.send('Registered Successfully')
})

app.post('/login',async (req, res) => {
        const {username,password} = req.body;
        let exist = await Registerr.findOne({username});
        if(!exist) {
              res.json(null);
         }
    else if(exist.password !== password) {
              res.json(null);
         }
        else{
        let auth={user:{id:exist._id} }
        jwt.sign(auth,'key',{expiresIn:3600000},(err,token)=> { res.json(token)})}
    }
    )

app.post('/chat/:name',checktoken,async(req,res)=>{
    const {message} = req.body;
    let currentDate = new Date();
    let cDay = currentDate.getDate();
    let cMonth = currentDate.getMonth() + 1;
    let cYear = currentDate.getFullYear();
    let sec=currentDate.getSeconds();
    if(sec<'10')
        sec='0'+sec
    let time = currentDate.getHours() + ":" + currentDate.getMinutes() + ":" +sec ;
     let date=  cDay + "/" + cMonth + "/" + cYear +"        "+time;
    const mschema= mongoose.model(`${req.params.name}`,msgschemas,`${req.params.name}`);
    let exist1 =await Registerr.findById(req.user.id)
    let newmessage= mschema({
        user:req.user.id,
        username:exist1.username,
        dateandtime:date,
        message
    })
    await newmessage.save();
    let exist =await mschema.find();
    res.send(exist)

})

app.get('/chat/:name',checktoken,async(req,res)=>{
    let name=req.params.name
    const mschema= mongoose.model(`${req.params.name}`,msgschemas,`${req.params.name}`);
    let exist =await mschema.find();
    res.send(exist)
})  

app.get('/username',checktoken,async(req,res)=>{
    let exist=await Registerr.findById(req.user.id);
    res.send(exist.username);
})


app.listen(5000,()=>{
    console.log('server running')
})