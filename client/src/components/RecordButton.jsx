import { useState } from "react";
import { Mic } from "lucide-react";

export default function RecordButton() {
  const [recording, setRecording] = useState(false);

  return (
    <button
      onClick={() => setRecording(!recording)}
      className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 
        ${recording ? "bg-red-500 shadow-red-500/50" : "bg-blue-500 shadow-blue-500/50"}
      `}
    >
      <Mic className="w-10 h-10 text-white" />
    </button>
  );
}
