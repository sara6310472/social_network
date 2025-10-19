import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import "../style/Register.css";
import { useState } from "react";

function Register() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const { register, handleSubmit } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      phoneNumber: "",
      website: "",
      password: ""
    },
  });

  const { error, flag, setFlag, checkExistingUser, finalregister } = useAuth();

  const onInitSubmit = async (data) => {
    const success = await checkExistingUser(
      data.email,
      password,
      verifyPassword
    );
    if (success) {
      setFlag(true);
    }
  };

  const onSubmit = async (data) => {
    const user = await finalregister(data, password);
    if (user) {
      navigate(`/users/${user.id}/home`);
    }
  };

  const registerOptions = {
    userName: { required: true },
    password: { required: true },
    verifyPassword: {
      required: true,
      validate: (value) => value === password || "Passwords do not match",
    },
    email: { required: true, pattern: /^\S+@\S+$/i },
    phone: { required: true, pattern: /^[0-9]{10}$/ },
  };

  return (
    <div className="formContainer">
      <div className="formCard">
        <h2 className="formTitle">Register</h2>
        {!flag && (
          <form onSubmit={handleSubmit(onInitSubmit)} className="form">
            <div className="formGroup">
              <label>Email</label>
              <input
                className="formInput"
                {...register("email", registerOptions.email)}
              />
            </div>
            <div className="formGroup">
              <label>Password</label>
              <input
                type="password"
                className="formInput"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label>Verify Password</label>
              <input
                type="password"
                className="formInput"
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
            </div>
            <div className="errorMessage">{error}</div>
            <button type="submit" className="btn btnPrimary">
              Next
            </button>
          </form>
        )}

        {flag && (
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="formGroup">
              <label>Name</label>
              <input
                type="text"
                className="formInput"
                {...register("name", registerOptions.userName)}
              />
            </div>
            <div className="formGroup">
              <label>Phone</label>
              <input
                type="tel"
                className="formInput"
                {...register("phoneNumber", registerOptions.phoneNumber)}
              />
            </div>
            <div className="formGroup">
              <label>Websit</label>
              <input
                type="txt"
                className="formInput"
                {...register("websit", registerOptions.websit)}
              />
            </div>
            <div className="errorMessage">{error}</div>
            <button type="submit" className="btn btnPrimary">
              Complete Registration
            </button>
          </form>
        )}
        <p className="formFooter">
          <Link to="/login" className="formLink">
            Already have an account? Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
