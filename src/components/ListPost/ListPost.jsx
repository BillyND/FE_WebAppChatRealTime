import React, { useEffect, useState } from "react";
import "./ListPost.scss";
import { getPost } from "../../services/api";
import { DeleteOutlined } from "@ant-design/icons";
import { useAuthUser } from "../../hooks/useAuthUser";

function ListPost(props) {
  const [listPost, setListPost] = useState([]);
  const { infoUser } = useAuthUser();

  console.log(">>>infoUser:", infoUser);

  useEffect(() => {
    handleGetListPost({ page: 1, limit: 5 });
  }, []);

  const handleGetListPost = async ({ page, limit }) => {
    const resListPost = await getPost(page, limit);

    setListPost(resListPost?.["results"]);

    console.log(">>>resListPost:", resListPost);
  };

  return (
    <div className="list-post-container pt-5 pb-5 mb-5">
      <h4>Feeds</h4>
      {listPost?.map((post) => {
        const isAuthorOfPost = post?.userId === infoUser?._id;
        return (
          <div key={post?._id} className="card-detail-post">
            <div className="header">
              <div className="info-user">
                <div
                  className="avatar"
                  style={{ backgroundImage: `url(${post?.avaUrl})` }}
                ></div>
                <div className="name">{post?.username}</div>
              </div>
              {isAuthorOfPost && <DeleteOutlined className="icon-delete" />}
            </div>

            <div className="description">{post?.description}</div>

            {post?.imageUrl && (
              <div className="image">
                <img src={post?.imageUrl} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListPost;
