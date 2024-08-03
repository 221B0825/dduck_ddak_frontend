import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import LoginView from './views/loginView/loginView';
import MainView from './views/mainView/mainView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginView />} />
      <Route path="/main" element={<MainView />} />
    </Routes>
  );
}

export default App;
