import React, { useState ,useEffect} from "react";
import {Clock , User , Trash2, Bookmark, ZoomIn, Pen} from "lucide-react"

function Card({count, duration, speaker, title, onTitleChange,transcription, cardId, onDelete}) {
  const [expanded, setExpanded] = useState(false);
  const [localTitle, setLocalTitle] = useState(title || `Recording#${count}`);
  const [isEditing, setIsEditing] = useState(false); 
 const [localtranscription, setLocalTranscription] = useState("");
const [isDeleting, setIsDeleting] = useState(false); 


  useEffect(() => {
    setLocalTitle(title);
  }, [title, count]);

  useEffect(() => {
    setLocalTranscription(transcription || "");
  }, [transcription]);


  const changeTitle = ()=>{
      setIsEditing(true);
  }

  const handleTitleChange = (e) => {
    setLocalTitle(e.target.value); 
  };

  const handleBlur = () => {
    setIsEditing(false); 
    onTitleChange(localTitle);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false); 
      onTitleChange(localTitle);
    }
    if (e.key === 'Escape') {
      setLocalTitle(title);
      setIsEditing(false); 
    }
  };

  const handleDelete = async () => {
    if (!onDelete) {
      console.log("❌ No delete function provided");
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
    } catch (error) {
      console.error("❌ Error in delete handler:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

  const displayTitle = isEditing ? localTitle : (title || localTitle);

  


  
  return (
    <div
      
      className="bg-gray-900 text-white rounded-lg p-4 shadow-lg  transition-all duration-300 ease-in-out w-full border border-gray-600">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex flex-row gap-3 text-sm items-center ">
              {isEditing ? (
              <input
                type="text"
                value={displayTitle}
                onChange={handleTitleChange}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-white text-lg outline-none"
              />
            ) : (
              <h3 className="font-semibold text-2xl">{displayTitle}</h3>
            )}
          {/* <h3 className="font-semibold text-2xl">Recording</h3> */}
          <Pen className="cursor-pointer w-5 h-5" onClick={changeTitle}/>
          </div>
          <div className="mt-1 flex flex-row gap-5">

            <div className="flex flex-row items-center">
            <Clock className="w-4 h-4 text-gray-500"/>
            <p className="ml-2 text-sm text-gray-500">{duration}</p>
            </div>

            <div className="flex flex-row items-center">
            <User className="w-4 h-4 text-gray-500"/>
            <p className="ml-2 text-sm text-gray-500">{speaker}</p>
            </div>

            <div className="flex flex-row items-center">
            <p className="ml-2 text-sm text-gray-500">{today}</p>
            </div>

          </div>
        </div>
        <div className="flex gap-3 text-gray-400">
          <ZoomIn className="cursor-pointer" onClick={() => setExpanded(!expanded)}/>
          <Bookmark className="hover:text-white"/>
          <Trash2 onClick={handleDelete} className="hover:text-red-500"/>
        </div>
      </div>

      
      
      <div className="bg-gray-800 p-3 rounded-lg mt-5">
          <h4 className="text-gray-300 font-semibold text-xl mb-2">Transcription</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            {transcription}
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