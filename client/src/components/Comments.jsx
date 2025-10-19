import { MdClose, MdDelete, MdEdit, MdSave } from "react-icons/md";
import { useUser } from "../contexts/useUser";
import { useData } from "../hooks/useData";
import PropTypes from "prop-types";
import { useState } from "react";

function Comments(props) {
  const { postId } = props;
  const { userData } = useUser();
  const {
    data: comments,
    isLoading,
    add: addComment,
    delete: deleteComment,
    edit: editComment,
  } = useData({
    resourceType: "comments",
    itemId: postId,
  });

  const [editingId, setEditingId] = useState(null);
  const [body, setBody] = useState("");
  const [newComment, setNewComment] = useState({
    postId,
    name: "",
    email: userData?.email || "",
    body: "",
  });

  return (
    <div className="commentsSection">
      <div className="commentsForm">
        <input
          type="text"
          className="formInput"
          placeholder="Name"
          value={newComment.name}
          onChange={(e) =>
            setNewComment((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <input
          className="formInput"
          placeholder="Comment"
          value={newComment.body}
          onChange={(e) =>
            setNewComment((prev) => ({ ...prev, body: e.target.value }))
          }
        />
        <button
          className="btn btnPrimary"
          onClick={() => addComment(newComment)}
        >
          Add Comment
        </button>
      </div>

      <div className="commentsList">
        {isLoading && <h3>Loading...</h3>}
        {comments.map((comment) => (
          <div key={comment.id} className="commentCard">
            <div className="commentHeader">
              <h4>{comment.name}</h4>
              {comment.email === userData?.email && (
                <div className="commentActions">
                  {editingId === comment.id ? (
                    <>
                      <button
                        className="btn btnPrimarySmall"
                        onClick={() => {
                          editComment(comment.id, { ...comment, body });
                          setEditingId(null);
                        }}
                      >
                        <MdSave />
                      </button>
                      <button
                        className="btn btnSecondarySmall"
                        onClick={() => setEditingId(null)}
                      >
                        <MdClose />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btnSecondarySmall"
                        onClick={() => setEditingId(comment.id)}
                      >
                        <MdEdit />
                      </button>
                      <button
                        className="btn btnDangerSmall"
                        onClick={() => deleteComment(comment.id)}
                      >
                        <MdDelete />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            <p className="commentEail">{comment.email}</p>
            {editingId === comment.id ? (
              <input
                className="formInput"
                value={body}
                onChange={(e) => {
                  const updated = { ...comment, body: e.target.value };

                  comments.map((c) =>
                    c.id === comment.id ? setBody(updated.body) : c
                  );
                }}
              />
            ) : (
              <p className="commentBody">{comment.body}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

Comments.propTypes = {
  postId: PropTypes.string.isRequired,
};

export default Comments;
