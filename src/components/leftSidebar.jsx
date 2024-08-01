import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 추가

function leftSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div id="leftSidebar-wrapper" className='bg-white' style={{position: 'fixed', left: 0, top: 0, height: '100vh', zIndex: 2000, width: isOpen ? '350px' : '50px', transition: 'width 0.3s ease-in-out'}}>
      <button id="leftSidebarBtn" onClick={toggleSidebar} className="btn btn-primary" style={{
        position: 'absolute',
        top: '50%',
        right: isOpen ? '-35px' : '-35px', // 토글 버튼이 왼쪽으로 나오도록 조정
        transform: 'translateY(-50%)'
      }}>
        {isOpen ? <i className="bi bi-caret-left-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
      </button>
      <div id='searchArea' className={`sidebar-heading ${isOpen ? '' : 'd-none'}`} style={{marginTop: '80px', padding: '20px'}}>
        <input
          type="text"
          className="form-control"
          placeholder="검색하세요"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <select className="form-select" value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)} style={{ marginBottom: '10px' }}>
          <option value="">지역 선택</option>
          <option value="Seoul">서울</option>
          <option value="Busan">부산</option>
          <option value="Incheon">인천</option>
          <option value="Daegu">대구</option>
        </select>
        <div className="d-flex justify-content-between">
          <button className="btn btn-outline-secondary" onClick={() => setSelectedRegion('')}>
            <i className="bi bi-x-lg"></i>
          </button>
          <button className="btn btn-primary" onClick={() => alert(`Searching for: ${searchQuery} in ${selectedRegion}`)}>
            <i className="bi bi-search"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default leftSidebar;
