const mongoose = require("mongoose");

const listSchema = new mongoose.Schema({
     name :{
        type : String
    },
     gender :{
        type : String
    },
     dob :{
        type : Date
    },
     mobile :{
        type : Number
    },
     address :{
        type : String
    },
    bloodGrp:{
        type :String
    },
    age :{
        type : Number
    },
    count :{
        type : Number
    }
    
})

const List = mongoose.model("List" ,listSchema);

module.exports = List;

