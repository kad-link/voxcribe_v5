import sys
import whisper

def main():
    if len(sys.argv) != 2:
        print("Usage: python transcribe.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)
    
    try:
        model = whisper.load_model("base")
        audio_path = sys.argv[1]
        result = model.transcribe(audio_path)
        print(result["text"])
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()