import React from 'react';
import { useAuth } from "../firebase/authContext";
import NavBar from '../components/NavBar';
import { Mic} from "lucide-react";
import Record from "../components/RecordButton"
import Card from "../components/Card"
import { useState, useEffect, useRef } from "react";

function Home() {
  const { currentUser, logout } = useAuth();
  const [cards, setCards] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); 
  const [speakerName, setSpeakerName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [audioStream, setAudioStream] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const timerRef = useRef(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  
  const deleteRecording = async (cardId, recordingId) => {
  if (!recordingId) {
    console.log("❌ No recording ID available for deletion");
    return;
  }

  // Show confirmation dialog
  const confirmed = window.confirm("Are you sure you want to delete this recording? This action cannot be undone.");
  if (!confirmed) {
    return;
  }

  try {
    console.log("🗑️ Deleting recording:", recordingId);

    const response = await fetch(`http://localhost:3000/api/recordings/${recordingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${currentUser?.accessToken || ''}`,
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Recording deleted successfully:", result);

      // Remove the card from the UI immediately
      setCards(prev => prev.filter(card => card.id !== cardId));
      
      // Optional: Show success message
      // You could add a toast notification here
      
    } else {
      const errorData = await response.json();
      console.error("❌ Failed to delete recording:", errorData);
      alert("Failed to delete recording. Please try again.");
    }

  } catch (error) {
    console.error("❌ Error deleting recording:", error);
    alert("Error deleting recording. Please check your connection and try again.");
  }
};


  const fetchRecordings = async()=>{

    if (!currentUser?.uid) {
        console.log("❌ No user ID available");
        setIsLoading(false);
        return;
    }


    try{
      setIsLoading(true);
      console.log("📋 Fetching recordings for user:", currentUser.uid);

      const response = await fetch(`http://localhost:3000/api/recordings/${currentUser.uid}`,{
        method:"GET",
        headers: {
          'Authorization': `Bearer ${currentUser?.accessToken || ''}`,
        }
      })

      if(response.ok){
        const result = await response.json();
        console.log("✅ Fetched recordings:", result);

        const transformedCards = result.recordings.map((recording, index) => ({
          id: recording._id,
          count: result.recordings.length - index, // Reverse count for newest first
          recordingId: recording._id,
          duration: formatTime(Math.floor(recording.duration)) || "00:00",
          speakerName: recording.speaker,
          title: recording.transcription && recording.transcription.length > 50 
            ? recording.transcription.substring(0, 50) + '...' 
            : recording.transcription || 'Untitled Recording',
          transcription: recording.transcription || ""
        }));

        setCards(transformedCards);
        console.log("📋 Loaded cards:", transformedCards.length);
      } else {
        console.error("❌ Failed to fetch recordings:", response.statusText);
      }

      }
      catch(error){
        console.error("❌ Error fetching recordings:", error);
      }
      finally {
      setIsLoading(false);
    }

    
  }


  useEffect(() => {
    if (currentUser) {
      fetchRecordings();
    }
  }, [currentUser]);




  const recordingDurationRef = useRef(0);

  const updateCardTitle = (cardId, newTitle) => {
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, title: newTitle } : card
    ));
  };

  const filteredCards = cards.filter(card => {
    if (!searchQuery) return true; 
    return card.title && card.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleMicClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      console.log("🎙️ Recording started...");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });
      
      setAudioStream(stream);
      setIsRecording(true);
      setRecordingTime(0);
      recordingDurationRef.current = 0;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("🎙️ Recording stopped, processing audio...");
        
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        setAudioBlob(audioBlob);
        
        // Use the stored duration from when recording actually stopped
        const finalSpeaker = speakerName.trim() || currentUser.displayName;
        const finalDuration = recordingDurationRef.current;
        const UserId = currentUser.uid;

        console.log("📤 Sending to backend:", {
          speaker: finalSpeaker,
          duration: finalDuration,
          audioSize: audioBlob.size
        });
        
        await sendAudioToBackend(audioBlob, finalSpeaker, finalDuration,UserId);

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
        setAudioStream(null);
      };

      mediaRecorder.start();
      console.log("🎙️ MediaRecorder started");
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    
    recordingDurationRef.current = recordingTime;
    
    console.log("🛑 Stopping recording. Duration:", recordingTime, "seconds");

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    
    const finalDuration = formatTime(recordingTime);
    const finalSpeaker = speakerName.trim() || currentUser.displayName;

    
    const newCard = {
      count: cards.length + 1,
      id: Date.now(),
      recordingId: null, 
      duration: finalDuration,
      speakerName: finalSpeaker,
      title: "Processing transcription...",
      transcription: ""
    };

    setCards((prev) => [newCard, ...prev]);

    
    setRecordingTime(0);
    setSpeakerName("");
  };

  const sendAudioToBackend = async (audioBlob, speaker, duration,UserId) => {
    try {
      console.log("📤 Preparing form data:", {
        speaker,
        duration,
        audioSize: audioBlob.size
      });
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('speaker', speaker); 
      formData.append('duration', duration.toString()); 
      formData.append('timestamp', new Date().toISOString());
      formData.append('userId', UserId);

      
      console.log("📋 FormData contents:");
      for (let [key, value] of formData.entries()) {
        if (key !== 'audio') {
          console.log(`  ${key}: ${value}`);
        } else {
          console.log(`  ${key}: [Blob, size: ${value.size}]`);
        }
      }

      const response = await fetch('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${currentUser?.accessToken || ''}`,
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Audio uploaded successfully:", result);
        
        
        if (result.transcription) {
          setCards(prev => {
            const updatedCards = [...prev];
            if (updatedCards.length > 0) {
              updatedCards[0] = {
                ...updatedCards[0],
                recordingId: result.recordingId,
                transcription: result.transcription,
                title: result.transcription.length > 50 
                  ? result.transcription.substring(0, 50) + '...' 
                  : result.transcription || 'Untitled Recording'
              };
            }
            return updatedCards;
          });
        }
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to upload audio:", response.statusText, errorText);
        
        
        setCards(prev => {
          const updatedCards = [...prev];
          if (updatedCards.length > 0) {
            updatedCards[0] = {
              ...updatedCards[0],
              title: "Transcription failed",
              transcription: "Error processing audio"
            };
          }
          return updatedCards;
        });
      }
      
    } catch (error) {
      console.error("❌ Error sending audio to backend:", error);
      
      
      setCards(prev => {
        const updatedCards = [...prev];
        if (updatedCards.length > 0) {
          updatedCards[0] = {
            ...updatedCards[0],
            title: "Network error",
            transcription: "Failed to send to server"
          };
        }
        return updatedCards;
      });
    }
  };

  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [audioStream]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  // Calculate total stats
  const totalNotes = cards.length;
  const totalDurationSeconds = cards.reduce((total, card) => {
    if (card.duration && card.duration.includes(':')) {
      const [min, sec] = card.duration.split(':').map(Number);
      return total + (min * 60) + sec;
    }
    return total;
  }, 0);

  return (
    <>
      <NavBar onlogout={handleLogout} username={currentUser.displayName} email={currentUser.email} profile={currentUser.photoURL}/>

      <div className="remaining-page bg-gray-900 w-full flex flex-row h-screen">
        <div className="left-content w-[35%] bg-gray-900 flex flex-col items-center">
          <div className="bg-gray-900 w-[90%] h-[370px] mt-5 rounded-lg border border-gray-600">
            <div className="flex items-center justify-center mt-5">
              <Mic className="w-5 h-5 text-gray-100" />
              <h2 className="text-gray-100 font-semibold ml-3 text-xl">Voice Recording</h2>
            </div>
            <h4 className="text-gray-500 ml-3">Record your voice and get AI-powered transcription</h4>
            
            <div className="px-3 mt-7">
              <h4 className="text-gray-300">Speaker Name:</h4>
              <input 
                type="text" 
                placeholder="Enter speaker name..." 
                value={speakerName}  
                onChange={(e) => setSpeakerName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 outline-none text-gray-50"
                disabled={isRecording}
              />
              <h6 className="text-xs text-gray-400 mt-2">
                {speakerName.trim() ? 
                  `Will use: ${speakerName.trim()}` : 
                  `Will use: ${currentUser.displayName}`
                }
              </h6>
            </div>

            <div className="flex flex-col justify-center items-center mt-10">
              <Record onClick={handleMicClick} isRecording={isRecording}/>
              

              <h5 className="text-gray-500 mt-3">
                {isRecording ? "Recording... Click to stop" : "Click to start recording"}
              </h5>
            </div>
          </div>

          <div className="bg-gray-900 w-[90%] h-[200px] mt-5 rounded-lg border border-gray-600">
            <h3 className="text-gray-50 p-6 font-semibold text-xl">Quick Stats</h3>

            <div className="flex flex-col gap-3 text-gray-400 text-sm px-6">
              <div className="flex justify-between items-center">
                <h4>Total Notes</h4>
                <span className="bg-gray-700 inline-flex items-center justify-center text-gray-200 px-2 py-1 rounded">
                  {totalNotes}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <h4>Bookmarked</h4>
                <span className="bg-gray-700 inline-flex items-center justify-center text-gray-200 px-2 py-1 rounded">0</span>
              </div>

              <div className="flex justify-between items-center">
                <h4>Total Duration</h4>
                <span className="bg-gray-700 inline-flex items-center justify-center text-gray-200 px-2 py-1 rounded">
                  {formatTime(totalDurationSeconds)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="right-content w-[65%] bg-gray-900 overflow-auto p-5">
          <div className="mt-5">
            <input 
              className="py-2 px-10 w-full rounded-lg outline-none text-gray-50 border border-gray-600 bg-gray-900"
              type='text' 
              placeholder='Search notes...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="cards mt-5 flex flex-col gap-3">
            {filteredCards.length === 0 && searchQuery ? (
              <div className="text-center text-gray-500 mt-10">
                <p>No recordings found matching "{searchQuery}"</p>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>No recordings yet. Start recording to see your notes here!</p>
              </div>
            ) : (
              filteredCards.map((card) => (
                <Card 
                  key={card.id}
                  cardId={card.recordingId} 
                  count={card.count}
                  duration={card.duration}
                  speaker={card.speakerName}
                  transcription={card.transcription}
                  title={card.title}
                  onTitleChange={(newTitle) => updateCardTitle(card.id, newTitle)}
                  onDelete={() => deleteRecording(card.id, card.recordingId)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;