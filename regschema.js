const mongoose = require('mongoose');
mongoose.set("debug", true);
mongoose.set("strictQuery", false);
const options = {
  strict: "throw",
  strictQuery: false
};
let Registerr = new mongoose.Schema({
    username :{
        type : String,
        required : true,
    },
    password :{
        type : String,
        required:true,
    },
    confirmpassword : {
        type : String,
        required : true,
    }
},options)

module.exports = mongoose.model('Registerr',Registerr)