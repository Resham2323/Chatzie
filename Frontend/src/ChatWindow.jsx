import { useContext, useState, useEffect } from 'react';
import Chat from './Chat'
import './ChatWindow.css';
import { MyContext } from './MyContext';
import { ScaleLoader } from "react-spinners";
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';


function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currThreadId, getAllThreads, prevChats, setPrevChats, setNewChats } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();


    const getReply = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        setNewChats(false)
        // console.log("message", prompt, "threadID", currThreadId);
        const options = {
            method: "POST",
            credentials: "include",  
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
            })
        };
        try {
            let response = await fetch("https://chatzie-vqlb.onrender.com/api/chat", options);
            let res = await response.json();
            console.log(res);
            setReply(res.reply);
            await getAllThreads();
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    //append new chats to prev chats

    useEffect(() => {
        if (prompt && reply) {
            setPrevChats(prevChats => [
                ...prevChats,
                {
                    role: "user",
                    content: prompt,
                },
                {
                    role: "assistant",
                    content: reply,
                }
            ]);
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
        toast.success('Loged out')
    };
    return (
        <>
            <div className='chatWindow'>
                <div className='navbar'>
                    <span className='chatzie'>Chatzie <i className="ri-arrow-down-s-line"></i></span>
                    <div className='userIconDiv' onClick={handleProfileClick}>
                        <span className='userIcon'><i className="ri-user-fill"></i></span>
                    </div>
                </div>
                {
                    isOpen &&
                    <div className="dropdown">
                        <div className="dropdownItem"><i className="fa-solid fa-gear"></i>Setting</div>
                        <div className="dropdownItem"><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan</div>
                        <div className="dropdownItem" onClick={handleLogout}><i class="ri-logout-box-line"></i>Logout</div>
                    </div>
                }
                <Chat />
                <ScaleLoader color='#fff' loading={loading} />
                <div className='chatInput'>
                    <div className='inputBox'>
                        <div className='addFiles'><i className="ri-add-line"></i></div>
                        <input type="text" name="userInput" placeholder='Ask anything'
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" ? getReply() : ''} />
                        <div id='submitIcon' onClick={getReply}> <i className="ri-send-plane-2-fill"></i></div>
                    </div>
                    <div className="info">
                        <p>Chatzie can make mistake. Check imortant information. See cookies preferences</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChatWindow;