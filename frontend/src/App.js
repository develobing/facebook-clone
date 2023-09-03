import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import CreatePostPopup from './components/createPostPopup';
import Home from './pages/home';
import Activate from './pages/home/activate';
import Login from './pages/login';
import Profile from './pages/profile';
import Reset from './pages/reset';
import LoggedInRoutes from './routes/LoggedInRoutes';
import NotLoggedInRoutes from './routes/NotLoggedInRoutes';

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  const [visible, setVisible] = useState(false);

  return (
    <div className="App">
      {user && visible && (
        <CreatePostPopup user={user} setVisible={setVisible} />
      )}

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Home setVisible={setVisible} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/activate/:token" element={<Activate />} />
        </Route>

        <Route element={<NotLoggedInRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/reset" element={<Reset />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;
