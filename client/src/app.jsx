import { Routes, Route , Navigate} from 'react-router-dom'
import Welcome from "./pages/Welcome"
import Home from "./pages/Home"
import { AuthProvider ,useAuth } from './firebase/authContext';


function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return currentUser ? children : <Navigate to="/" replace />;
}

function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  return currentUser ? <Navigate to="/home" replace /> : children;
}




function AppRoutes() {
  return (
    <main className="min-h-screen bg-zinc-900">
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Welcome />
            </PublicRoute>
          } 
        />

        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </main>
  );
}






function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App
