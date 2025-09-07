import React, { useState } from "react";
import img from "../assets/favicon.jpg"

function ProfileCard({onlogout}){

    const [open, setOpen] = useState(false);

    const openProfileBox= ()=>{
        setOpen(!open);
    }

    return(
        <>
        <div className="profile-box w-14 h-14 rounded-md">
        <img src={img} alt=":/" className="h-14 w-14 object-cover rounded-full cursor-pointer" 
        onClick={openProfileBox}/>

        {open &&  (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 rounded-lg shadow-lg p-4 z-50 border border-gray-700">
                <div className="flex items-center space-x-4">
                    <img
                        src={img}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                     <div>
                    <h4 className="font-bold text-gray-200">Sri Charan</h4>
                    <p className="text-sm text-gray-400">sri.charan@email.com</p>
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