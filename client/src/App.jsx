import { Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/UserProvider";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Error from "./components/Error";
import Todos from "./components/Todos";
import Posts from "./components/Posts";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/users/:userId/*" element={<MainLayout />}>
          <Route path="home/*" element={<Home />} />
          <Route path="todos/*" element={<Todos />} />
          <Route path="posts/*" element={<Posts />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainLayout />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </UserProvider>
  );
}
export default App;
