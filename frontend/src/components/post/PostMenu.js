import { useRef, useState } from 'react';
import MenuItem from './MenuItem';
import useOnClickOutside from '../../helpers/clickOutside';

export default function PostMenu({
  postUserId,
  userId,
  imagesLength,
  setShowMenu,
}) {
  const [isMyPost, setIsMyPost] = useState(
    postUserId === userId ? true : false
  );
  const menu = useRef(null);

  useOnClickOutside(menu, () => setShowMenu(false));

  return (
    <ul className="post_menu" ref={menu}>
      {isMyPost && <MenuItem icon="pin_icon" title="Pin Post" />}
      <MenuItem
        icon="save_icon"
        title="Save Post"
        subtitle="Add this to your saved items."
      />
      <div className="line"></div>

      {isMyPost && <MenuItem icon="edit_icon" title="Edit Post" />}
      {!isMyPost && (
        <MenuItem
          icon="turnOnNotification_icon"
          title="Turn on notifications for this post"
        />
      )}
      {imagesLength && <MenuItem icon="download_icon" title="Download" />}
      {imagesLength && (
        <MenuItem icon="fullscreen_icon" title="Enter Fullscreen" />
      )}
      {isMyPost && (
        <MenuItem img="../../../icons/lock.png" title="Edit audience" />
      )}
      {isMyPost && (
        <MenuItem
          icon="turnOffNotifications_icon"
          title="Turn off notifications for this post"
        />
      )}
      {isMyPost && (
        <MenuItem icon="delete_icon" title="Turn off translations" />
      )}
      {isMyPost && <MenuItem icon="date_icon" title="Edit Date" />}
      {isMyPost && (
        <MenuItem icon="refresh_icon" title="Refresh share attachment" />
      )}
      {isMyPost && <MenuItem icon="archive_icon" title="Move to archive" />}
      {isMyPost && (
        <MenuItem
          icon="trash_icon"
          title="Move to trash"
          subtitle="items in your trash are deleted after 30 days"
        />
      )}

      {!isMyPost && <div className="line"></div>}
      {!isMyPost && (
        <MenuItem
          img="../../../icons/report.png"
          title="Report post"
          subtitle="i'm concerned about this post"
        />
      )}
    </ul>
  );
}
