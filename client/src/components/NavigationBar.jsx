import { NavLink, useParams, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/useUser";
import "../style/NavigationBar.css";
import PropTypes from "prop-types";
import { useEffect } from "react";

function NavigationBar(props) {
  const { setShowInfo } = props;

  const { userId } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();

  useEffect(() => {
    if (!userData) {
      const user = JSON.parse(localStorage.getItem("currentUser"));
      if (!user) {
        return;
      }

      if (!userId) {
        return navigate(`/users/${user.id}`);
      }

      if (userId !== String(user.id)) {
        return navigate("/error");
      }
      setUserData(user);
    }
  }, [userData, setUserData, navigate, userId]);

  return (
    <header className="mainHeader">
      <div className="headerContent">
        <nav className="navMenu">
          {[ "posts", "todos"].map((route) => (
            <NavLink
              key={route}
              className="navLink"
              to={`/users/${userId}/${route}`}
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </NavLink>
          ))}
          <button
            className="navLink"
            onClick={() => setShowInfo((prev) => !prev)}
          >
            Info
          </button>
        </nav>
        <div className="userControls">
          {userData?.username && (
            <h2 className="welcomeMessage">Welcome {userData?.username}</h2>
          )}
        </div>
        <button
          className="btnLogout"
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

NavigationBar.propTypes = {
  setShowInfo: PropTypes.func.isRequired,
};

export default NavigationBar;
