import React, { useState } from "react";
import {Clock , User , Trash2, Bookmark} from "lucide-react"

function Card() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-gray-900 text-white rounded-lg p-4 shadow-lg  transition-all duration-300 ease-in-out w-full border border-gray-600">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-2xl">Recording</h3>
          <div className="mt-1 flex flex-row gap-5">

            <div className="flex flex-row items-center">
            <Clock className="w-4 h-4 text-gray-500"/>
            <p className="ml-2 text-sm text-gray-500">06:32</p>
            </div>

            <div className="flex flex-row items-center">
            <User className="w-4 h-4 text-gray-500"/>
            <p className="ml-2 text-sm text-gray-500">Sri Charan</p>
            </div>

            <div className="flex flex-row items-center">
            <p className="ml-2 text-sm text-gray-500">05/09/2025</p>
            </div>

          </div>
        </div>
        <div className="flex gap-3 text-gray-400">
          <Bookmark className="hover:text-white"/>
          <Trash2 className="hover:text-red-500"/>
        </div>
      </div>

      
      
      <div className="bg-gray-800 p-3 rounded-lg mt-5">
          <h4 className="text-gray-300 font-semibold text-xl mb-2">Transcription</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            This is where the full transcription of the audio recording will
            appear. You can load the entire text here for the user to read.
          </p>
        </div>

      
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          expanded ? "max-h-40 mt-4" : "max-h-0"
        }`}>

        <div className="bg-blue-950 text-blue-100 rounded-lg p-3 mt-3">
        <h2 className="text-gray-300 font-semibold text-xl mb-2">Summary</h2>
        <p>
          "The project is a really big success. The project is really a big
          success," he said. "It's a really good project. It's really a great
          project"
        </p>
      </div>

      
      </div>
    </div>
  );
}

export default Card;
