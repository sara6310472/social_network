import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

export const useAuth = () => {
  const [error, setError] = useState("");
  const [flag, setFlag] = useState(false);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const navigate = useNavigate();

  const handleTokenExpiration = (errorData) => {
    if (errorData && errorData.redirectToLogin) {
      localStorage.removeItem("currentUser");
      setUserData(null);
      navigate("/login", {
        state: { message: errorData.error || "Your session has expired. Please login again." }
      });
    }
  };

  const handleResponse = async (response) => {
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.redirectToLogin) {
        handleTokenExpiration(errorData);
      }
      throw new Error(errorData.error || "An error occurred");
    }
    return await response.json();
  };

  const authActions = {
    checkExistingUser: async (email, password, verifyPassword) => {
      if (password !== verifyPassword) {
        setError("The password is incorrect");
        return false;
      }
      try {
        const response = await fetch(
          `${BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );
        if (response.ok) throw new Error("Error");
        setFlag(true);
        return true;
      } catch (error) {
        setError(error.message);
        return false;
      }
    },

    finalregister: async (data, password) => {
      try {
        const response = await fetch(`${BASE_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
          }),
        });

        const newUser = await handleResponse(response);
        localStorage.setItem("currentUser", JSON.stringify(newUser));
        setUserData(newUser);
        return newUser;
      } catch (error) {
        setError(error.message);
        return null;
      }
    },

    login: async (data) => {
      try {
        const response = await fetch(
          `${BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const user = await handleResponse(response);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setUserData(user);
        return user;
      } catch (error) {
        setError(error.message);
        return null;
      }
    },

    logout: () => {
      localStorage.removeItem("currentUser");
      setUserData(null);
      navigate("/login");
    },

    getToken: () => {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        const { token } = JSON.parse(currentUser);
        return token;
      }
      return null;
    },

    checkTokenValidity: async () => {
      const token = authActions.getToken();
      if (!token) {
        navigate("/login");
        return false;
      }

      try {
        const response = await fetch(`${BASE_URL}/verify-token`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.redirectToLogin) {
            handleTokenExpiration(errorData);
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error("Error verifying token:", error);
        return false;
      }
    }
  };

  useEffect(() => {
    if (userData) {
      authActions.checkTokenValidity();
    }
  }, []);

  return {
    error,
    setError,
    flag,
    setFlag,
    userData,
    setUserData,
    ...authActions,
  };
};