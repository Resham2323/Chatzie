import './Sidebar.css';

function Sidebar() {
    return ( 
        <>
        <section className='sidebar'>
            <button>
                <img src="" alt="" />
                <i className="fa-solid fa-pen-to-square"></i>
            </button>

            <ul>
                <li>history1</li>
                <li>history2</li>
                <li>history3</li>
                <li>history4</li>
            </ul>

            <div className='sign'>
                <p>by Resham &hearts;</p>
            </div>
        </section>
        </>
     );
}

export default Sidebar;