import React from "react";
import icon from "../assets/favicon.jpg"
import ProfileCard from "./ProfileCard";

function NavBar({onlogout}){





    return(
        <>
        <div className="Nav-class bg-gray-900 w-full h-[12vh] border-b border-gray-700 text-white flex  items-center px-6 ">
            
            <img src={icon} alt=":/" className="h-10 w-10 object-cover rounded-lg" />
            <div>
          <h2 className="text-2xl px-4 font-bold gradient-shift-text tracking-normal"> VOXCRIBE</h2>
          <h5 className="text-sm px-4 text-slate-400">Transcription made easy</h5>
            </div>
            
            <div className="ml-auto">
                <ProfileCard onlogout={onlogout}/>
            </div>
            
        </div>

        <style jsx>{`
        
        .gradient-shift-text {
    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6);
    background-size: 400% 400%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 6s ease-in-out infinite;
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
      `}</style>
        </>

        
    )
}


export default NavBar;