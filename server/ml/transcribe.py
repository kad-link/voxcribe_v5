import sys
import whisper

def main():
    if len(sys.argv) != 2:
        print("Usage: python transcribe.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)
    
    try:
        # Load the Whisper model
        model = whisper.load_model("base")
        
        # Get audio path from command line argument
        audio_path = sys.argv[1]
        
        # Transcribe the audio file
        result = model.transcribe(audio_path)
        
        # Print only the transcription text (this will be captured by Node.js)
        print(result["text"])
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()