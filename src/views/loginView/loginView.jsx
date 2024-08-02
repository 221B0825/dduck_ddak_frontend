import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginView() {
  const navigate = useNavigate();

  const handleLogin = () => {

    // 로그인 성공 시
    navigate('/main');  // '/main' 경로로 이동
  };

  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin}>Login</button>  {/* 버튼 클릭 시 handleLogin 함수 실행 */}
    </div>
  );
}

export default LoginView;
