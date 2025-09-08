const express = require("express");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
import openai from "openai";
import { Readable } from "stream";
import cors from 'cors';
import Recording from "./models/Recording";



const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 50*1024*1024}
});

app.post("/api/transcribe",upload.single("audio") ,async(req,res)=>{


    try{
            const audioBuffer = req.file.buffer;
            const {speaker, duration, timestamp} = req.body;
            const transcriptionID = uuidv4();

            const stream = Readable.from(audioBuffer);
            stream.path = `${transcriptionID}.webm`;

            const transcription = await openai.Audio.Transcriptions.create({
                file:stream,
                model: "whisper-1"
            })

            const recording = new Recording({
                transcriptionID,
                speaker,
                duration,
                timestamp,
                transcription: transcription.text
            })

            await recording.save();



            res.json({
                success:true,
                transcriptionID: transcriptionID,
                transcription: transcription.text,
                message: "200 status OK"
            })
    }   
    
    catch(error){
        console.error("Error occurred: ",error);
        res.status(500).json({error: "Failed to transcribe"});
    }
})




app.listen(3000);