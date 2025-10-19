import PropTypes from "prop-types";
import "../style/Info.css";

function Info(props) {
  const { userInfo, onClose } = props;
  if (!userInfo) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContainer">
        <div className="modalHeader">
          <h2>User Information</h2>
        </div>
        <div className="modalContent">
          <div className="infoGroup">
            <label htmlFor="name">Name:</label>
            <span>{userInfo.name}</span>
          </div>
          <div className="infoGroup">
            <label htmlFor="email">Email:</label>
            <span>{userInfo.email}</span>
          </div>
          <div className="infoGroup">
            <label htmlFor="phone">Phone:</label>
            <span>{userInfo.phoneNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

Info.propTypes = {
  userInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bs: PropTypes.string.isRequired,
      catchPhrase: PropTypes.string.isRequired,
    }).isRequired,
    address: PropTypes.shape({
      street: PropTypes.string.isRequired,
      suite: PropTypes.string,
      city: PropTypes.string.isRequired,
      zipcode: PropTypes.string.isRequired,
    }).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default Info;
