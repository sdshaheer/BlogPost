import React, { useState } from "react";
import { verifyEmail, verifyPassword } from "../../pages/Verification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../reduxStore/AuthStore";
import { modalActions } from "../../reduxStore/ModalStore";
import { Link } from "react-router-dom";
import classes from "./login.module.css";
import MyModal from "../../Modals/MyModal";

const Login = () => {
  const isLoading = useSelector((state) => state.modal.isLoading);
  const loadModal = useSelector((state) => state.modal.loadModal);
  const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);

  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const handleModal = () =>{
  //   setLoadModal(false)
  // }

  const emailChange = (e) => {
    setEmailState(e.target.value);
  };
  const passwordChange = (e) => {
    setPasswordState(e.target.value);
  };

  const emailBlur = () => {
    const email = emailState;
    const emailMessage = verifyEmail(email);
    if (emailMessage !== null) {
      setEmailError(true);
      setEmailMessage(emailMessage);
      return false;
    }
    setEmailError(false);
    setEmailMessage("");
    return true;
  };
  const passwordBlur = () => {
    // Blur for Password
    const password = passwordState;
    const passwordMessage = verifyPassword(password);
    if (passwordMessage !== null) {
      setPasswordError(true);
      setPasswordMessage(passwordMessage);
      return false;
    }
    setPasswordError(false);
    setPasswordMessage("");
    return true;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const checkEmail = emailBlur();
    const checkPassword = passwordBlur();

    if (!checkEmail || !checkPassword) {
      return;
    }

    try {
      dispatch(modalActions.setIsLoading(true)); // dispatch
      const { data } = await axios.post("/api/v1/users/login", {
        email: emailState,
        password: passwordState,
      });
      console.log(data);
      if (data?.success) {
        dispatch(modalActions.setIsLoading(false)); // dispatch
        sessionStorage.setItem("accessToken", `Bearer ${data.accessToken}`);
        sessionStorage.setItem("refreshToken", `Bearer ${data.refreshToken}`);
        localStorage.setItem("isLogin", true);
        dispatch(authActions.login()); // dispatch
        dispatch(authActions.setUserName(data.user.username));
        navigate("/home");
      }
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      //console.log(error.response.data.message);
    }
  };

  

  return (
    <div className="container-md">
      {isLoading && (
        <div className="fs-3 w-100 h-50 text-center">Loading ...</div>
      )}
      <div className="row justify-content-center align-items-center">
        <div
          className={`mt-5 p-4 col-md-4 col-sm-6 rounded-2 ${classes.shadow}`}
        >
          <div className="d-flex justify-content-center">
            <img
              className={classes.blogImage}
              src="https://www.hudsonintegrated.com/pub/blogimages/20140305094710_blog49006_640.png"
              alt="blog image"
            />
          </div>
          <form onSubmit={submitHandler}>
            <div className="mb-3">
              <input
                className={`form-control mt-4 ${
                  emailError ? "is-invalid" : ""
                }`}
                type="email"
                placeholder="Enter Email"
                onChange={emailChange}
                onBlur={emailBlur}
              />
              {emailError && (
                <span className="text-danger">{emailMessage}</span>
              )}
            </div>
            <div className="mb-3">
              <input
                className={`form-control mt-4 ${
                  passwordError ? "is-invalid" : ""
                }`}
                type="password"
                placeholder="Enter Password"
                onChange={passwordChange}
                onBlur={passwordBlur}
              />
              {passwordError && (
                <span className="text-danger">{passwordMessage}</span>
              )}
            </div>
            <div className="d-flex flex-column mt-4">
              <button className="btn btn-primary" type="submit">
                Login
              </button>
              <span className="text-center p-3">OR</span>
              <div>
                <Link className="nav-link text-center" to="/register">
                  CREATE AN ACCOUNT
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <MyModal
        show={loadModal}
        hide={() => dispatch(modalActions.setLoadModal(false))}
        message={loadModalMessage}
      />
    </div>
  );
};
export default Login;
