import { MdDelete, MdEdit, MdSave, MdClose } from "react-icons/md";
import PropTypes from "prop-types";
import { useState } from "react";

function Todo(props) {
  const { todo, onToggle, onDelete, onEdit } = props;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo);

  return (
    <div className={`itemCard ${todo.completed ? "completed" : ""}`}>
      <div className="itemHeader">
        <div
          className={`customCheckbox ${todo.completed ? "checked" : ""}`}
          onClick={() => onToggle(todo)}
        />
        {isEditing ? (
          <input
            type="text"
            className="editInput"
            value={editedTitle.title}
            onChange={(e) => setEditedTitle({ ...editedTitle, 'title': e.target.value })}
          />
        ) : (
          <span className="itemTitle">{todo.title}</span>
        )}
      </div>
      <div className="itemActions">
        {isEditing ? (
          <>
            <button
              className="btn btnPrimary"
              onClick={() => {
                onEdit(todo.id, editedTitle);
                setIsEditing(false);
              }}
            >
              <MdSave />
            </button>
            <button
              className="btn btnSecondary"
              onClick={() => setIsEditing(false)}
            >
              <MdClose />
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btnSecondary"
              onClick={() => setIsEditing(true)}
            >
              <MdEdit />
            </button>
            <button className="btn btnDanger" onClick={() => onDelete(todo)}>
              <MdDelete />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

Todo.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Todo;
