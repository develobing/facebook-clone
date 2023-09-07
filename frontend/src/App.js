import axios from 'axios';
import { useEffect, useReducer, useState } from 'react';
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

function reducer(state, action) {
  switch (action.type) {
    case 'POSTS_REQUEST':
      return { ...state, loading: true, error: '' };

    case 'POSTS_SUCCESS':
      return { ...state, loading: false, posts: action.payload, error: '' };

    case 'POSTS_ERROR':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

function App() {
  const { user } = useSelector((state) => ({ ...state }));
  const [visible, setVisible] = useState(false);
  const [{ loading, error, posts }, dispatch] = useReducer(reducer, {
    loading: false,
    error: '',
    posts: [],
  });

  const getAllPosts = async () => {
    try {
      dispatch({ type: 'POSTS_REQUEST' });

      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/getAllPosts`,

        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      dispatch({ type: 'POSTS_SUCCESS', payload: data });
    } catch (error) {
      console.log('getAllPosts() - error', error);
      dispatch({ type: 'POSTS_ERROR', payload: error.response.data.message });
    }
  };

  useEffect(() => {
    if (user) getAllPosts();
  }, [user]);

  return (
    <div className="App">
      {user && visible && (
        <CreatePostPopup user={user} setVisible={setVisible} />
      )}

      <Routes>
        <Route element={<LoggedInRoutes />}>
          <Route
            path="/"
            element={<Home posts={posts} setVisible={setVisible} />}
          />
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
