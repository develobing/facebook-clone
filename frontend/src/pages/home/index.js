import { useSelector } from 'react-redux';
import CreatePost from '../../components/createPost';
import Header from '../../components/header';
import LeftHome from '../../components/home/left';
import RightHome from '../../components/home/right';
import Stories from '../../components/home/stories';
import './style.css';
import SendVerification from '../../components/home/sendVerification';

export default function Home() {
  const { user } = useSelector((user) => ({ ...user }));

  return (
    <div className="home">
      <Header />

      <LeftHome user={user} />

      <div className="home_middle">
        <Stories />
        {!user.verified && <SendVerification user={user} />}
        <CreatePost user={user} />
      </div>

      <RightHome user={user} />
    </div>
  );
}
