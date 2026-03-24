import './Sidebar.css';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from './MyContext';
import { v1 as uuidv1 } from 'uuid';


function Sidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedThread, setSelectedThread] = useState(null);
    
    const { allThreads, setAllThreads, currThreadId, setNewChats, setReply, setPrompt, setCurrThreadId, setPrevChats } = useContext(MyContext);

const deleteThread = async (threadId) => {
    try {
        const res = await fetch(`http://localhost:8080/api/thread/${threadId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        const data = await res.json();
        console.log(data);

        setAllThreads(prev => prev.filter(t => t.threadId !== threadId));
        setIsOpen(false);

    } catch (err) {
        console.log(err);
    }
};

    const handleDeleteThread = (threadId) => {
        setSelectedThread(threadId);
        setIsOpen(true);
    };

    const getAllThreads = async () => {
        console.log("getAllThreads called");
        try {
            const response = await fetch("http://localhost:8080/api/thread", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }); const res = await response.json();

            if (!res) {
                console.log("empty response")
                return;
            }

            let filterThreads = res?.threads?.map(thread => ({
                threadId: thread.threadId,
                title: thread.title
            })) || [];

            console.log("FILTER THREADS:", filterThreads); // ⭐ check


            setAllThreads(filterThreads);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        console.log("run getAllThreads");
        getAllThreads();
    }, [currThreadId]);

    const createNewChat = () => {
        setNewChats(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`, {
                withCredentials: true
            });
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChats(false);
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <>
            <section className='sidebar'>
                <button className='chatbtn' onClick={createNewChat}>
                    <img src="src/assets/chatGpt-logo.jpg" alt="chatzie logo" className='logo' />
                    <span><i className="fa-solid fa-pen-to-square"></i></span>
                </button>

                <ul className='history'>
                    {
                        allThreads?.map((thread) => (
                            <li
                                key={thread.threadId}
                                onClick={() => changeThread(thread.threadId)}
                                className={thread.threadId === currThreadId ? "highlighted" : ""}
                            >
                                {thread.title.slice(0, 40)}

                                <i
                                    className="fa-solid fa-trash"
                                    id="dltIcon"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 🔥 important (thread change na ho)
                                        handleDeleteThread(thread.threadId);
                                    }}
                                ></i>

                            </li>
                        ))
                    }
                </ul>
                {
                    isOpen &&
                    <div className="dropdown-wrapper">
                        <div className="dropdown-div">
                            <p >
                                Are you sure you want to delete <br />
                            </p>
                            <div className="button-group">

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => deleteThread(selectedThread)}
                                    className="btn btn-error"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    </div>
                }


                <div className='sign'>
                    <p>by Resham &hearts;</p>
                </div>

            </section>
        </>
    )
};

export default Sidebar;