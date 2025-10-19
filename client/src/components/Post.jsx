import { useLocation, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Comments from "./Comments";
import { useEffect, useState } from "react";
import {
  MdClose,
  MdComment,
  MdDelete,
  MdEdit,
  MdSave,
  MdVisibility,
  MdVisibilityOff,
  MdZoomIn,
} from "react-icons/md";

function Post(props) {
  const { post, onDelete, onEdit } = props;
  const { userId } = useParams();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({ ...post });
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const id = location.pathname.split("/").pop();
    if (id == post.id && !showModal) {
      setShowModal(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, post]);

  return (
    <div className={`${!showModal && "itemCard"}`}>
      <div className="itemHeader">
        <h3 className="itemTitle">{post.title}</h3>
        <div className="itemActions">
          <button
            className="btn btnSecondary"
            onClick={() => {
              navigate(String(post.id));
            }}
          >
            <MdZoomIn />
          </button>
        </div>
        {showModal && (
          <div
            className="itemModal"
            onClick={() => {
              setShowModal(false);
              const index = location.pathname.indexOf("posts");
              if (index !== -1) {
                const newPath = location.pathname.substring(
                  0,
                  index + "posts".length
                );
                navigate(newPath);
              }
            }}
          >
            <div
              className="itemModalContent"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="itemCard modalCard">
                {isEditing ? (
                  <input
                    type="text"
                    className="editInput"
                    value={editedPost.title}
                    onChange={(e) =>
                      setEditedPost((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                ) : (
                  <h3 className="itemTitle">{post.title}</h3>
                )}
              </div>
              <div className="itemActions">
                <button
                  className="btn"
                  onClick={() => {
                    setShowComments((prev) => !prev);
                    location.pathname.includes("comments")
                      ? navigate(location.pathname.replace("/comments", ""))
                      : navigate("comments");

                  }}
                >
                  <MdComment />
                </button>
                <button
                  className="btn"
                  onClick={() => setIsExpanded((prev) => !prev)}
                >
                  {isExpanded ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
                {userId == post.userId && (
                  <>
                    {!isEditing ? (
                      <>
                        <button
                          className="btn btnSecondary"
                          onClick={() => setIsEditing(true)}
                        >
                          <MdEdit />
                        </button>
                        <button
                          className="btn btnDanger"
                          onClick={() => {
                            onDelete(post);
                            const index = location.pathname.indexOf("posts");
                            if (index !== -1) {
                              const newPath = location.pathname.substring(
                                0,
                                index + "posts".length
                              );
                              navigate(newPath);
                            }
                          }}
                        >
                          <MdDelete />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btnPrimary"
                          onClick={() => {
                            onEdit(editedPost);
                            setIsEditing(false);
                          }}
                        >
                          <MdSave />
                        </button>
                        <button
                          className="btn btnSecondary"
                          onClick={() => {
                            setEditedPost({ ...post });
                            setIsEditing(false);
                          }}
                        >
                          <MdClose />
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {isExpanded && (
                <div className="itemCard">
                  {isEditing ? (
                    <input
                      className="editInput"
                      value={editedPost.body}
                      onChange={(e) =>
                        setEditedPost((prev) => ({
                          ...prev,
                          body: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <p>{post.body}</p>
                  )}
                </div>
              )}

              {showComments && <Comments postId={post.id} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    userId: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default Post;
