import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUserAsync,
  selectAuthState,
} from "../AuthSlice";
import logo from "../../../assets/logo.png"


export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const validations = {
    email: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: "Invalid email format",
      },
      validate: (email) => {
        if (email.trim() === "") return "Email field can't be empty";
        return true;
      },
    },

    password: {
      required: {
        value: true,
        message: "Password is required",
      },
      validate: (password) => {
        if (password.trim() === "") return "Password field can't be empty";
        return true;
      },
    },
  };

  const dispatch = useDispatch();
  const loginState = useSelector(selectAuthState);
  const navigate = useNavigate();

  function formSubmitHandler({ email, password }) {
    dispatch(loginUserAsync({ email, password ,navigate}));
  }

  

  return (
    <>
      <div className="flex min-h-screen w-screen items-center justify-center px-4 py-10">
        <div className="login-form-wrapper glass-panel mx-auto w-full max-w-md p-8">
          <div className="image-wrapper flex flex-col items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white p-2 shadow-card">
              <img
                src={logo}
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.28em] text-brand-600">
              Welcome back
            </p>
            <div className="mt-2 px-4 text-center text-3xl font-black tracking-tight text-slate-950">
              Log in to your account
            </div>
            <p className="mt-3 text-center text-sm text-slate-500">
              Use the demo credentials to explore shopping and admin flows.
            </p>
          </div>
          {/* form starts */}
          <form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="form-wrapper mt-8 flex flex-col gap-5"
          >
            {/* email field */}
            <div className="email">
              <label htmlFor="email" className="text-sm font-bold text-slate-700">
                Email address
              </label>
              <input
                type="text"
                {...register("email", { ...validations.email })}
                className="input-field mt-2 w-full"
              />
              {errors.email && (
                <span className="text-sm text-red-600">
                  *{errors.email.message}
                </span>
              )}
            </div>

            {/* password field */}
            <div className="password relative">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-bold text-slate-700">
                  Password
                </label>
                <br />
                <span className="text-center text-sm font-semibold text-brand-600 hover:cursor-pointer hover:text-brand-700">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </span>
              </div>
              {!showPassword ? (
                <FaEye
                  className="absolute right-4 top-10 h-5 w-5 cursor-pointer text-slate-500"
                  onClick={() => setShowPassword((prevVal) => !prevVal)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute right-4 top-10 h-5 w-5 cursor-pointer text-slate-500"
                  onClick={() => setShowPassword((prevVal) => !prevVal)}
                />
              )}

              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { ...validations.password })}
                className="input-field mt-2 w-full pr-12"
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  *{errors.password.message}
                </span>
              )}
            </div>

            {/* login Button */}
            <button
              className="btn-primary h-12 w-full"
              disabled={loginState.status !== "idle"}
            >
              {loginState.status !== "idle" ? "Logging" : "Log in"}
            </button>

            {/* sign up link */}
            <div className="signup-link mt-3 text-center">
              <span className="text-center text-sm text-slate-500">
                Not a member?{" "}
              </span>

              <span className="text-center text-sm font-bold text-brand-600 hover:cursor-pointer hover:text-brand-700">
                <Link to="/signup">Create an account</Link>
              </span>
            </div>
          </form>
          {/* form ends */}
        </div>
      </div>
    </>
  );
}
