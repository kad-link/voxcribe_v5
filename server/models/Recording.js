const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        process.exit(1);
    }
};

connectDB();


const recordingSchema = new mongoose.Schema({
    transcriptionID : {
        type:String,
        required:true,
        unique:true
    },

    speaker : {
        type:String,
        required:true
    },

    userId : {
        type:String,
        required:true
    },

    duration : {
        type:Number,
        required:true
    },

    timestamp : {
         type: Date,
          required: true 
    },

    transcription : {
        type: String
    }

} , { timestamps: true })



module.exports =  mongoose.model("recording", recordingSchema);
