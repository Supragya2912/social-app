
import React, { useEffect } from "react";
import { meApi } from "./utils/api";
import { Route, Routes, useNavigate } from 'react-router-dom';
import SignupScreen from './components/SignupScreen';
import Login from './components/Login';
import Register from './components/Register';
import Post from './components/Posts';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './redux/reducers/loginReducer';


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await meApi();
        if (response.status === 200) {
          const {_id, email, userName, accessToken} =response.data;
          dispatch(loginSuccess({_id, email, userName, accessToken}));
          navigate("/posts");
        }
      } catch (err) {
        console.error(err)
      }
    };
    checkAuth();
  },[dispatch, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<SignupScreen/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/posts" element={<Post/>} />
      </Routes>
    </div>
  );
}

export default App;
