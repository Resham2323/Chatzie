import './App.css'
import ChatWindow from './ChatWindow';
import { MyContext } from './MyContext';
import Sidebar from './Sidebar';
import { useState } from 'react';
import { v1 as uuidv1 } from 'uuid';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChats, setNewChats]= useState(true);
  const [ allThreads, setAllThreads]= useState([]);

  const providerValue = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    prevChats, setPrevChats,
    newChats, setNewChats,
    allThreads, setAllThreads
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={
          <ProtectedRoute>
            <div className='main'>
              <MyContext.Provider value={providerValue} >
                <Sidebar />
                <ChatWindow />
                <Toaster />
              </MyContext.Provider>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
