import React, { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginApi } from "../utils/api";
import { loginSuccess } from '../redux/reducers/loginReducer';
import { useDispatch } from 'react-redux';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'; // Import icons

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!formData.email || !formData.password) {
        setError("All fields are required");
        return;
      }
      try {
        const response = await loginApi(formData);
        if (response.status === 400) {
          setError(response.data.message);
          return;
        }
        localStorage.setItem("token", response.data.token);
        const {_id, email, userName, accessToken} =response.data.data;
        dispatch(loginSuccess({_id, email, userName, accessToken}));
        setError("");
        navigate("/posts");
      } catch (err) {
        setError("Something went wrong");
      }
    },
    [formData, navigate, dispatch]
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full sm:max-w-md"
      >
        <div className="mb-4 text-center">
          <FiLock className="text-4xl mb-4 text-blue-500 mx-auto" /> {/* Lock icon */}
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
        </div>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-1">
            <FiMail className="inline-block mr-2" />Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border border-gray-300 rounded-md px-4 py-2 w-full"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-1">
            <FiLock className="inline-block mr-2" />Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 px-3 py-2 focus:outline-none"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/" className="text-blue-500">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
