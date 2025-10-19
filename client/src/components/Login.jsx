import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "Adeline70@hotmail.com",
      password: "123456",
    },
  });

  const { error, login } = useAuth();

  const onSubmit = async (data) => {
    const user = await login(data);
    if (user) {
      navigate(`/users/${user.id}/home`);
      return;
    }
  };

  return (
    <div className="formContainer">
      <div className="formCard">
        <h2 className="formTitle">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="formInput"
              placeholder="Enter email"
              {...register("email", { required: true, minLength: 3 })}
            />
          </div>
          <div className="formGroup">
            <label htmlFor="password" className="formLabel">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="formInput"
              placeholder="Enter password"
              {...register("password", { required: true, minLength: 6 })}
            />
          </div>
          <div className="errorMessage">{error}</div>
          <button type="submit" className="btn btnPrimary">
            Login
          </button>
        </form>
        <p className="formFooter">
          Dont have an account?
          <Link to="/register" className="formLink">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
