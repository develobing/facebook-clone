import { useSelector } from 'react-redux';
import CreatePost from '../../components/createPost';
import Header from '../../components/header';
import LeftHome from '../../components/home/left';
import RightHome from '../../components/home/right';
import SendVerification from '../../components/home/sendVerification';
import Stories from '../../components/home/stories';
import Post from '../../components/post';
import './style.css';

export default function Home({ posts, setVisible }) {
  const { user } = useSelector((user) => ({ ...user }));

  return (
    <div className="home">
      <Header />

      <LeftHome user={user} />

      <div className="home_middle">
        <Stories />
        {!user.verified && <SendVerification user={user} />}
        <CreatePost user={user} setVisible={setVisible} />

        <div className="posts"></div>
        {posts.map((post) => (
          <Post key={post._id} post={post} user={user} />
        ))}
      </div>

      <RightHome user={user} />
    </div>
  );
}
