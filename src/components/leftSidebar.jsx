import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 추가

function leftSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="leftSidebar-wrapper" className='bg-white' style={{position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 2000, width: isOpen ? '250px' : '50px', transition: 'width 0.3s ease-in-out'}}>
      <button id="leftSidebarBtn" onClick={toggleSidebar} className="btn btn-primary" style={{
        position: 'absolute',
        top: '50%',
        right: isOpen ? '-35px' : '-35px', // 토글 버튼이 왼쪽으로 나오도록 조정
        transform: 'translateY(-50%)'
      }}>
        {isOpen ? <i className="bi bi-caret-left-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
      </button>
      <div className={`sidebar-heading ${isOpen ? '' : 'd-none'}`}>Left Sidebar</div>
      <div className={`list-group list-group-flush ${isOpen ? '' : 'd-none'}`}>
        <a href="#" className="list-group-item list-group-item-action bg-light">New Arrivals</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Most Popular</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Trends</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Collections</a>
        <a href="#" className="list-group-item list-group-item-action bg-light">Sales</a>
      </div>
    </div>
  );
}

export default leftSidebar;
