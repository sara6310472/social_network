import {
  useParams,
  Outlet,
  useNavigate,
  useLocation,
  NavLink,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/useUser";
import NavigationBar from "./NavigationBar";
import Info from "./Info";
import "../style/NavigationBar.css";

function MainLayout() {
  const { userId } = useParams();
  const [showInfo, setShowInfo] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, setUserData } = useUser();

  useEffect(() => {
    const validateRoute = () => {
      let user;
      if (userData) user = userData;
      else user = JSON.parse(localStorage.getItem("currentUser"));

      if (!user) {
        return;
      }

      const pathSegments = location.pathname.split("/").filter(Boolean);

      if (!userId) {
        return navigate(`/users/${user.id}`);
      }

      if (userId !== String(user.id)) {
        return navigate("/error");
      }

      if (pathSegments.length >= 3) {
        const resourceType = pathSegments[2];
        if (!["todos", "posts", "home"].includes(resourceType)) {
          return navigate("/error");
        }
      }

      if (!userData) {
        setUserData(user);
      }
    };

    validateRoute();
  }, [userData, setUserData, navigate, userId, location.pathname]);

  return (
    <div className="appLayout">
      <NavigationBar setShowInfo={setShowInfo} />
      {showInfo && (
        <Info userInfo={userData} onClose={() => setShowInfo(false)} />
      )}
      {!userData && (
        <div className="error">
          <h2>Authentication Required</h2>
          <p>You must be logged in to access this site.</p>
          <NavLink to="/login">Go to Login</NavLink>
        </div>
      )}
      <main className="mainContent">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
