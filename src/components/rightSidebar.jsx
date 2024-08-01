import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 추가

function RightSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="rightSidebar-wrapper" className='bg-white' style={{position: 'fixed', right: 0, top: 0, height: '100vh', zIndex: 2000, width: isOpen ? '400px' : '50px', transition: 'width 0.3s ease-in-out'}}>
      <button id='rightSidebarBtn' onClick={toggleSidebar} className="btn btn-primary" style={{
        position: 'absolute',
        top: '50%',
        left: isOpen ? '0px' : '-35px',
        transform: `translateY(-50%) ${isOpen ? 'translateX(-100%)' : 'translateX(0)'}`
      }}>
        {isOpen ? <i className="bi bi-caret-right-fill"></i> : <i className="bi bi-caret-left-fill"></i>}
      </button>
      <div className={`sidebar-heading ${isOpen ? '' : 'd-none'}`}>Right Sidebar</div>
      <div className={`list-group list-group-flush ${isOpen ? '' : 'd-none'}`}>
        <a href="#" className="list-group-item list-group-item-action bg-light">Upcoming Events</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Recent News</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Top Achievements</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Featured Articles</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Community Spotlight</a>
      </div>
    </div>
  );
}

export default RightSidebar;
