import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useData } from "../hooks/useData";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import "../style/Posts.css";
import Post from "./Post";

function Posts() {
  const { userId } = useParams();
  const {
    data: posts,
    isLoading,
    filters,
    setFilters,
    add: addPost,
    delete: deletePost,
    edit: editPost,
    getAll: getAllPosts,
  } = useData({
    resourceType: "posts",
    itemId: userId,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const [showAllUsersPosts, setShowAllUsersPosts] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    body: "",
    userId: userId
  });

  const handleAddPost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) return;

    await addPost(newPost);
    setNewPost({ title: "", body: "" });
    setIsFormVisible(false);
  };

  return (
    <div className="pageContainer">
      <div className="pageHeader">
        <h1>Posts </h1>
        <div className="controlsGroup">
          <SearchBar
            setFilters={setFilters}
            filters={filters}
            setIsFormVisible={setIsFormVisible}
          >
            <button
              className={`btn ${showAllUsersPosts ? "btnPrimary" : "btnSecondary"
                }`}
              onClick={() => {
                setShowAllUsersPosts((prev) => !prev);
                getAllPosts(!showAllUsersPosts ? null : userId);
                location.pathname.includes("all")
                  ? navigate(location.pathname.replace("/all", ""))
                  : navigate("all");
              }}
            >
              {showAllUsersPosts ? "Show My Posts" : "Show All Users Posts"}
            </button>
          </SearchBar>

          <div className={`addItemForm ${!isFormVisible ? "hidden" : ""}`}>
            <input
              id="add"
              type="text"
              className="formInput"
              placeholder="Title"
              value={newPost.title}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <input
              id="addBody"
              type="text"
              className="formInput"
              placeholder="Content"
              value={newPost.body}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, body: e.target.value }))
              }
            />
            <button
              className="btn btnPrimary"
              onClick={() => {
                handleAddPost();
                setIsFormVisible(!isFormVisible);
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="gridLayout">
        {isLoading ? (
          <h3>Loading...</h3>
        ) : posts.length === 0 ? (
          <div>No posts available</div>
        ) : (
          posts.map((post) => (
            <Post
              key={post.id}
              post={post}
              onDelete={deletePost}
              onEdit={editPost}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Posts;
