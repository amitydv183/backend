const mongoose = require("mongoose")
const db = async ()=>{
    try{
        return mongoose.connect(process.env.LIVE_URL,console.log("database connected"));
    }catch(error){
        console.log(error);
    }
}
module.exports = db;