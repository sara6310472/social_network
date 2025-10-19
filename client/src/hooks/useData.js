import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

export const useData = ({
  resourceType,
  itemId,
  defaultFilters = {
    searchTerm: "",
    searchById: "",
    sortBy: "id",
    completed: null,
  },
}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { userId } = useParams();
  const navigate = useNavigate();

  const getAuthToken = () => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const { token } = JSON.parse(currentUser);
      return token;
    }
    return null;
  };

  const createAuthHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    };
  };

  const handleTokenExpiration = (error) => {
    if (error.redirectToLogin) {
      localStorage.removeItem("currentUser");
      navigate("/login", { state: { message: "Your session has expired. Please login again." } });
    }
  };

  const parentIdField = {
    todos: "userId",
    posts: "userId",
    comments: "postId",
  }[resourceType];

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      let url = `${BASE_URL}/users/${itemId}/${resourceType}`;

      if (resourceType === 'comments') {
        url = `${BASE_URL}/users/${userId}/posts/${itemId}/${resourceType}`
      }
      const response = await fetch(url, {
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.redirectToLogin) {
          handleTokenExpiration(errorData);
          return;
        }
        throw new Error("Error");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(`Error fetching ${resourceType}:`, error);
    }
    setIsLoading(false);
  }, [resourceType, itemId, page, parentIdField, userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (itemData) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${itemData.userId}/${resourceType}`, {
        method: "POST",
        headers: createAuthHeaders(),
        body: JSON.stringify({
          [parentIdField]: itemId,
          ...itemData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.redirectToLogin) {
          handleTokenExpiration(errorData);
          return;
        }
        throw new Error("Error");
      }

      const newItem = await response.json();
      setData((prev) => [newItem, ...prev]);
      return newItem;
    } catch (error) {
      console.error(`Error adding ${resourceType}:`, error);
    }
  };

  const editItem = async (id, updates) => {
    try {
      const response = await fetch(`${BASE_URL}/users/${updates.userId}/${resourceType}/${id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({
          id,
          [parentIdField]: itemId,
          ...updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.redirectToLogin) {
          handleTokenExpiration(errorData);
          return;
        }
        throw new Error("Error");
      }

      const updatedItem = await response.json();
      setData((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      return updatedItem;
    } catch (error) {
      console.error(`Error updating ${resourceType}:`, error);
    }
  };

  const deleteItem = async (itemData) => {
    try {
      const deleteResponse = await fetch(`${BASE_URL}/users/${itemData.userId}/${resourceType}/${itemData.id}`, {
        method: "DELETE",
        headers: createAuthHeaders(),
      });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        if (errorData.redirectToLogin) {
          handleTokenExpiration(errorData);
          return;
        }
        throw new Error("Error");
      }

      setData((prev) => prev.filter((i) => i.id !== itemData.id));
    } catch (error) {
      console.error(`Error deleting ${resourceType}:`, error);
    }
  };

  const toggleItem = async (itemData) => {
    if (resourceType !== "todos") return;

    try {
      const response = await fetch(`${BASE_URL}/users/${itemData.userId}/todos/${itemData.id}`, {
        method: "PUT",
        headers: createAuthHeaders(),
        body: JSON.stringify({
          ...itemData,
          completed: !itemData.completed,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.redirectToLogin) {
          handleTokenExpiration(errorData);
          return;
        }
        throw new Error("Error");
      }

      const updatedItem = await response.json();
      setData((prev) =>
        prev.map((todo) => (todo.id === itemData.id ? updatedItem : todo))
      );
      return updatedItem;
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const getAllItem = async (id) => {
    if (resourceType !== "posts") return;

    if (id) {
      fetchData();
      return;
    }
    try {
      let url = `${BASE_URL}/${resourceType}`;

      const response = await fetch(url, {
        headers: createAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.redirectToLogin) {
          handleTokenExpiration(errorData);
          return;
        }
        throw new Error("Error");
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error(`Error fetching ${resourceType}:`, error);
    }
  };

  const filteredData = useCallback(() => {
    return [...data]
      .filter((item) => {
        const searchField = item.title || item.body || "";
        const matchesSearch = searchField
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

        const matchesId = item.id.toString().includes(filters.searchById);

        const matchesCompleted =
          filters.completed === null ||
          !("completed" in item) ||
          item.completed === !filters.completed;

        return matchesSearch && matchesId && matchesCompleted;
      })
      .sort((a, b) => {
        if (filters.sortBy === "id") return a.id - b.id;
        if (filters.sortBy === "title") {
          const aField = a.title || a.body || "";
          const bField = b.title || b.body || "";
          return aField.localeCompare(bField);
        }
        return 0;
      });
  }, [data, filters]);

  return {
    data: filteredData(),
    isLoading,
    filters,
    setFilters,
    hasMore,
    add: addItem,
    edit: editItem,
    delete: deleteItem,
    toggle: toggleItem,
    getAll: getAllItem,
  };
};