import React from 'react';
import { useAuth } from "../firebase/authContext";
import NavBar from '../components/NavBar';
import { Mic } from "lucide-react";
import { useState } from "react";
import Record from "../components/RecordButton"



function Home() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
  
  
  
  <>
  
  <NavBar onlogout={handleLogout}/>

  <div className="remaining-page bg-white w-full h-[calc(100vh-64px)] flex flex-row">
    <div className="left-content w-[35%] bg-gray-900 flex flex-col items-center ">
        <div className="bg-gray-900 w-[90%] h-[370px] mt-5 rounded-lg border border-gray-600">

                <div className="flex items-center justify-center mt-5">
                  <Mic className="w-5 h-5 text-gray-100 " />
                   <h2 className="text-gray-100 font-semibold ml-3 text-xl">Voice Recording</h2>
                </div>
                <h4 className="text-gray-500 ml-3">Record your voice and get AI-powered transcription</h4>
                
                <div className="px-3 mt-7">
                <h4 className="text-gray-300">Speaker Name :</h4>
                <input type="text" placeholder="Enter speaker name . . ." className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 outline-none " />
                <h6 className="text-xs text-gray-400 mt-2">Will use your name : Sri Charan Chittineni</h6>
                </div>

                <div className="flex flex-col justify-center items-center mt-10">
                  <Record />
                  <h5 className="text-gray-500 mt-3">Click to start recording</h5>
                </div>

        </div>
        <div className="bg-gray-900 w-[90%] h-[200px] mt-5 rounded-lg border border-gray-600">
            <h3 className="text-gray-50 p-6 font-semibold text-xl">Quick Stats</h3>

            <div className="flex flex-col gap-3 text-gray-400 text-sm px-6">
              <div className="flex justify-between items-center">
                <h4>Total Notes</h4>
                 <span className="bg-gray-700 inline-flex items-center justify-center text-gray-200 px-2 py-1 rounded">1</span>
                </div>

                <div className="flex justify-between items-center">
                <h4>Bookmarked</h4>
                 <span className="bg-gray-700 inline-flex items-center justify-center text-gray-200 px-2 py-1 rounded">1</span>
                </div>

                <div className="flex justify-between items-center">
                <h4>Total Duration</h4>
                 <span className="bg-gray-700 inline-flex items-center justify-center text-gray-200 px-2 py-1 rounded">1</span>
                </div>
                
            </div>
        </div>
    </div>
    <div className="right-content w-[65%] bg-blue-400">
      Right Div
    </div>
  </div>
  
  </>
  
  );
}

export default Home;