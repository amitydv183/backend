const mongoose = require("mongoose")
const db = async ()=>{
    try{
        return mongoose.connect("mongodb://127.0.0.1:27017/petcare",console.log("database connected"));
    }catch(error){
        console.log(error);
    }
}
module.exports = db;