import { Mic } from "lucide-react";

export default function RecordButton({ onClick, isRecording }) {
  return (
    <button
      onClick={onClick}
      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 
        ${isRecording ? "bg-red-500 shadow-red-500/50" : "bg-blue-500 shadow-blue-500/50"}
      `}
    >
      <Mic className="w-10 h-10 text-white" />
    </button>
  );
}