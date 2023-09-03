import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Activate from './pages/home/activate';
import Login from './pages/login';
import Profile from './pages/profile';
import LoggedInRoutes from './routes/LoggedInRoutes';
import NotLoggedInRoutes from './routes/NotLoggedInRoutes';
import Reset from './pages/reset';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route path="/" element={<Home />} />
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
