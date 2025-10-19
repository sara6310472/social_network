import { useData } from "../hooks/useData";
import { useParams } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import "../style/Todos.css";
import Todo from "./Todo";

function Todos() {
  const { userId } = useParams();
  const {
    data: todos,
    isLoading,
    filters,
    setFilters,
    add: addTodo,
    delete: deleteTodo,
    edit: editTodo,
    toggle: toggleTodo,
  } = useData({
    resourceType: "todos",
    itemId: userId,
  });

  const [newTodo, setNewTodo] = useState({ title: "", completed: false, userId: userId });
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleAddTodo = async () => {
    if (!newTodo.title.trim()) return;

    await addTodo(newTodo);
    setNewTodo((prev) => ({ ...prev, title: "" }));
    setIsFormVisible(false);
  };

  return (
    <div className="pageContainer">
      <div className="pageHeader">
        <h1>Todos </h1>
        <div className="controlsGroup">
          <SearchBar
            setFilters={setFilters}
            filters={filters}
            setIsFormVisible={setIsFormVisible}
          >
            <button
              className={`btn ${showIncomplete ? "btnPrimary" : "btnSecondary"
                }`}
              onClick={() => {
                setShowIncomplete((prev) => !prev);
                setFilters((prev) => ({
                  ...prev,
                  completed: prev.completed ? null : !prev.completed,
                }));
              }}
            >
              {showIncomplete ? "Show All" : "Show Incomplete"}
            </button>
          </SearchBar>

          <div className={`addItemForm ${!isFormVisible ? "hidden" : ""}`}>
            <input
              id="add"
              type="text"
              className="formInput"
              placeholder="Add new..."
              value={newTodo.title}
              onChange={(e) =>
                setNewTodo((prev) => ({ ...prev, title: e.target.value }))
              }
            />
            <button
              className="btn btnPrimary"
              onClick={() => {
                handleAddTodo();
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
        ) : todos.length === 0 ? (
          <div>No todos available</div>
        ) : (
          todos.map((todo) => (
            <Todo
              key={todo.id}
              todo={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Todos;
