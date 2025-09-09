import './App.css'
import ChatWindow from './ChatWindow';
import { MyContext } from './MyContext';
import Sidebar from './Sidebar';

function App() {

  const providerValue = {};
  return (
    <>
    <div className='main'>
      <MyContext.Provider value={providerValue} >
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
      </div>
    </>
  )
}

export default App;
