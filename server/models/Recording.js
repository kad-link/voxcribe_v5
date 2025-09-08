import mongoose from "mongoose";

const connectDB = mongoose.connect(process.env.MONGO_URL);

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

    duration : {
        type:String,
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



export default mongoose.model("recording", recordingSchema);
