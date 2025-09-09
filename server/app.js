const express = require("express");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const Recording = require("./models/Recording");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {fileSize: 50*1024*1024}
});

const transcribeWithWhisper = (audioPath) => {
    return new Promise((resolve, reject) => {
        // Get the full path to transcribe.py (inside ml folder)
        const scriptPath = path.join(__dirname, 'ml', 'transcribe.py');
        const python = spawn('python3', [scriptPath, audioPath]);
        
        let stdout = '';
        let stderr = '';
        
        python.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        python.on('close', (code) => {
            if (code === 0) {
                resolve(stdout.trim());
            } else {
                reject(new Error(`Python script failed with code ${code}: ${stderr}`));
            }
        });
        
        python.on('error', (error) => {
            reject(new Error(`Failed to start Python process: ${error.message}`));
        });
    });
};

app.post("/api/transcribe", upload.single("audio"), async(req, res) => {
    console.log("\n🚀 === NEW TRANSCRIBE REQUEST ===");
    let tempFilePath = null;
    
    try {
        // Log everything we receive
        console.log("📝 Request body:", req.body);
        console.log("📎 File info:", {
            hasFile: !!req.file,
            originalname: req.file?.originalname,
            mimetype: req.file?.mimetype,
            size: req.file?.size
        });
        
        if (!req.file) {
            console.log("❌ No file received");
            return res.status(400).json({ error: "No audio file provided" });
        }

        const audioBuffer = req.file.buffer;
        const { speaker, duration, timestamp } = req.body;
        const transcriptionID = uuidv4();
        
        console.log("🎵 Processing audio:", {
            transcriptionID,
            speaker,
            duration,
            timestamp,
            bufferSize: audioBuffer.length
        });
        
        // Save audio buffer to temporary file
        const fileExtension = req.file.originalname?.split('.').pop() || 'webm';
        tempFilePath = path.join(os.tmpdir(), `${transcriptionID}.${fileExtension}`);
        
        console.log("💾 Writing temp file to:", tempFilePath);
        await fs.writeFile(tempFilePath, audioBuffer);
        
        // Check if file was actually written
        const stats = await fs.stat(tempFilePath);
        console.log("✅ Temp file created, size:", stats.size);
        
        // Transcribe using Python Whisper
        console.log("🤖 Starting transcription...");
        const transcriptionText = await transcribeWithWhisper(tempFilePath);
        console.log("✅ Transcription result:", {
            length: transcriptionText.length,
            preview: transcriptionText.substring(0, 100) + "..."
        });
        
        // Prepare data for database
        const recordingData = {
            transcriptionID,
            speaker: speaker || "Unknown Speaker",
            duration: parseFloat(duration) || 0,
            timestamp: new Date(timestamp),
            transcription: transcriptionText
        };
        
        console.log("💾 Preparing to save:", recordingData);
        
        // Save to database
        const recording = new Recording(recordingData);
        
        console.log("🔄 Calling recording.save()...");
        const savedRecording = await recording.save();
        console.log("✅ Successfully saved to database:", {
            id: savedRecording._id,
            transcriptionID: savedRecording.transcriptionID,
            createdAt: savedRecording.createdAt
        });
        
        res.json({
            success: true,
            transcriptionID: transcriptionID,
            transcription: transcriptionText,
            recordingId: savedRecording._id,
            message: "Recording transcribed and saved successfully"
        });
        
    } catch(error) {
        console.error("❌ ERROR DETAILS:", {
            name: error.name,
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        
        // More specific error handling
        if (error.name === 'ValidationError') {
            console.log("📋 Validation errors:", error.errors);
            return res.status(400).json({
                error: "Validation failed",
                details: error.message,
                validationErrors: error.errors
            });
        }
        
        if (error.code === 11000) {
            return res.status(409).json({
                error: "Duplicate transcription ID",
                details: "This recording has already been processed"
            });
        }
        
        res.status(500).json({
            error: "Failed to process recording",
            details: error.message
        });
    } finally {
        // Clean up temporary file
        if (tempFilePath) {
            try {
                await fs.unlink(tempFilePath);
                console.log("🗑️ Temp file cleaned up");
            } catch (cleanupError) {
                console.warn("⚠️ Failed to cleanup temp file:", cleanupError.message);
            }
        }
        console.log("🏁 === REQUEST COMPLETED ===\n");
    }
});

// Add this test endpoint to verify database is working
app.get('/api/test-save', async (req, res) => {
    try {
        console.log("🧪 Testing database save...");
        
        const testRecording = new Recording({
            transcriptionID: `test-${Date.now()}`,
            speaker: "Test Speaker",
            duration: 30,
            timestamp: new Date(),
            transcription: "This is a test transcription"
        });
        
        const saved = await testRecording.save();
        console.log("✅ Test save successful:", saved._id);
        
        res.json({
            success: true,
            testRecordingId: saved._id,
            message: "Database save test successful"
        });
        
    } catch (error) {
        console.error("❌ Test save failed:", error);
        res.status(500).json({
            error: "Database save test failed",
            details: error.message
        });
    }
});

// Add this to check existing records
app.get('/api/recordings', async (req, res) => {
    try {
        const recordings = await Recording.find().sort({ createdAt: -1 }).limit(10);
        const count = await Recording.countDocuments();
        
        res.json({
            success: true,
            count,
            recordings
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch recordings",
            details: error.message
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});