const mongoose=require('mongoose');
mongoose.set("debug", true);
mongoose.set("strictQuery", false);
const options = {
  strict: "throw",
  strictQuery: false
};
let msgschema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
    ref:'Register'
    },
    username:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }

},options)

module.exports=mongoose.model('msgschema',msgschema);