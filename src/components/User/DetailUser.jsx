import React from "react";
import { useAuthUser } from "../../hooks/useAuthUser";

function DetailUser(props) {
  const {
    infoUser: { avaUrl, username, followers, followings },
  } = useAuthUser();

  return (
    <div className="detail-user-container">
      <div className="avatar-container">
        <img src={avaUrl} className="avatar" alt="User Avatar" loading="lazy" />
      </div>

      <span className="name-user">{username}</span>

      <div className="detail-follows">
        <div className="detailed">
          <span className="count-follow">{followers?.length || 0}</span>
          <span className="title-follow">Followers</span>
        </div>

        <div className="detailed">
          <span className="count-follow">{followings?.length || 0}</span>
          <span className="title-follow">Following</span>
        </div>
      </div>
    </div>
  );
}

export default DetailUser;
