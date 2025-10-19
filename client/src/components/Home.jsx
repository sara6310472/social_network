import { useUser } from "../contexts/useUser";
import "../style/Error.css";

const Home = () => {
  const { userData } = useUser();

  return (
    <div className="userControls">
      <h2 className="welcomeMessageTypewriter">
        {userData &&
          [
            `Welcome ${userData.name} To the site`,
            "Ready to start an exciting new project?",
            "Organize tasks effortlessly and create content tailored just for you.",
            "Discover inspiration and unique ideas from our community.",
            "Share your creations and add your personal touch.",
            "Express your message with images and a style that reflects you.",
          ].map((line, index) => (
            <span key={index} style={{ "--line-index": index }}>
              {line}
            </span>
          ))}
      </h2>
    </div>
  );
};

export default Home;
