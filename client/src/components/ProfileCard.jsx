import React, { useState } from "react";
import img from "../assets/favicon.jpg"
import { User } from "lucide-react";

function ProfileCard({onlogout, username, email, profile}){

    const [open, setOpen] = useState(false);

    const openProfileBox= ()=>{
        setOpen(!open);
    }




    return(
        <>
        <div className="profile-box w-14 h-14 rounded-md">

        {profile ? (
                        <img src={profile} alt=":/" className="h-14 w-14 object-cover rounded-full cursor-pointer" 
                    onClick={openProfileBox}/>
                    ):(
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                         </div>
                    )}

        

        {open &&  (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg p-4 z-50 border border-gray-700">
                <div className="flex items-center space-x-4">

                    {profile ? (
                        <img
                        src={profile|| "/default-avatar.png"}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    ):(
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                         </div>
                    )}
                    
                     <div className="min-w-0">
                    <h4 className="font-bold text-gray-200 break-words">{username}</h4>
                    <p className="text-sm text-gray-400 break-words">{email}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <button onClick={onlogout} className="bg-gray-700 w-full py-2 rounded-md font-semibold text-red-500 hover:bg-red-800 hover:text-gray-100 transition">
                        Sign Out
                    </button>
                </div>
            </div>
        )}
            
        </div>
        </>
    )
}


export default ProfileCard