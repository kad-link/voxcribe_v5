import React from 'react';
import bgvid from "../assets/bgvid.mp4"

function BreathingText() {
  return (

    

    <div className="min-h-screen bg-slate-900 flex items-center justify-between p-8 lg:p-16 relative overflow-hidden">


        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
            >
        <source src={bgvid} type="video/mp4" />
            our microbots are constantly working to render the complete functionality
            </video>




      
      <div className="flex-1 max-w-2xl ml-20">
        
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          </div>
        </div>

        
        <div className="mb-15">
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-400 mb-2 ml-4 leading-tight">
            WELCOME TO
          </h1>
          <h2 className="text-4xl md:text-7xl lg:text-8xl mb-6 font-medium breathing-gradient-text tracking-tight">
            VOXCRIBE
          </h2>
          <h3 className="text-slate-300 sm:text-2xl md:text-3xl lg:text-4xl text-4xl font-extralight ml-3">Transcription made easy</h3>
        </div>

        
        <div className="space-y-1 text-slate-400 text-small mt-10">
          <div className="flex items-center space-x-3">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>
            <span>Accurate voice transcription</span>
          </div>
          <div className="flex items-center space-x-3">
         <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>
            <span>Smart note organization</span>
          </div>
          <div className="flex items-center space-x-3">
         <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>
            <span>Real-time processing</span>
          </div>
        </div>
      </div>

      
      <div className="flex-shrink-0 ml-4 lg:ml-16">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 w-96 lg:w-[32rem]">
          <h3 className="text-3xl font-semibold text-white mb-3 text-center gradient-shift-text">Get Started</h3>
          
          <button className="w-full bg-white hover:bg-gray-100 text-slate-900 font-medium py-4 px-6 rounded-xl flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <p className="text-xs text-slate-500 text-center mt-6 leading-relaxed">
            By continuing, you agree to our{' '}
            <a target="_blank" href="https://www.bmw.in/en/footer/metanavigation/bmw-connected-drive-tnc.html" className="text-blue-400 hover:underline">Terms of Service</a> and{' '}
            <a target="_blank"  href="https://www.bmw.in/en/footer/metanavigation/privacy-policy.html" className="text-blue-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>

 

      
      <style jsx>{`
        .breathing-gradient-text {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #8b5cf6, #3b82f6);
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: breathe 4s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% {
            background-position: 0% 50%;
            transform: scale(1);
          }
          50% {
            background-position: 100% 50%;
            transform: scale(1.02);
          }
        }

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
    </div>
  );
}

export default BreathingText;