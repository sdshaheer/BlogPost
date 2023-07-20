import React, { useState } from "react";
import {
  verifyEmail,
  verifyName,
  verifyPassword,
} from "../../pages/Verification";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import classes from "./register.module.css";
import { useDispatch, useSelector } from "react-redux";
import EmailModal from "../../Modals/EmailModal";
import { modalActions } from "../../reduxStore/ModalStore";
import MyModal from "../../Modals/MyModal";

const Register = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.modal.isLoading);
  const loadModal = useSelector((state) => state.modal.loadModal);
  const loadModalMessage = useSelector((state) => state.modal.loadModalMessage);

  const [nameState, setNameState] = useState("");
  const [emailState, setEmailState] = useState("");
  const [passwordState, setPasswordState] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [nameMessage, setNameMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const navigate = useNavigate();

  const nameChange = (e) => {
    setNameState(e.target.value);
  };
  const emailChange = (e) => {
    setEmailState(e.target.value);
  };
  const passwordChange = (e) => {
    setPasswordState(e.target.value);
  };

  const nameBlur = () => {
    const name = nameState;
    const nameMessage = verifyName(name);
    if (nameMessage !== null) {
      setNameError(true);
      setNameMessage(nameMessage);
      return false;
    }
    setNameError(false);
    setNameMessage("");
    return true;
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

  const createUser = async (otp) => {
    console.log("in create user", otp, nameState);
    try {
      dispatch(modalActions.setLoadModal(false));
      dispatch(modalActions.setIsLoading(true)); // dispatch
      const { data } = await axios.post("/api/v1/users/register", {
        username: nameState,
        email: emailState,
        password: passwordState,
        otp: otp,
      });
      console.log("create user", data);
      if (data?.success) {
        dispatch(modalActions.setIsLoading(false)); // dispatch
        navigate("/login");
      }
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      console.log(error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const checkEmail = emailBlur();
    const checkPassword = passwordBlur();
    const checkName = nameBlur();

    if (!checkEmail || !checkPassword || !checkName) {
      return;
    }

    // try {
    //   dispatch(modalActions.setIsLoading(true)); // dispatch
    //   const { data } = await axios.post("/api/v1/users/register", {
    //     username: nameState,
    //     email: emailState,
    //     password: passwordState,
    //   });
    //   if (data?.success) {
    //     dispatch(modalActions.setIsLoading(false)); // dispatch
    //     dispatch(modalActions.setLoadModal(true))
    //     navigate("/login");
    //   }
    // } catch (error) {
    //   dispatch(modalActions.setIsLoading(false)); // dispatch
    //   dispatch(modalActions.setLoadModal(true)); // dispatch
    //   dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
    //   console.log(error);
    // }
    try {
      dispatch(modalActions.setIsLoading(true)); // dispatch
      const { data } = await axios.post("/api/v1/users/generateOtp", {
        username: nameState,
        email: emailState,
        password: passwordState,
      });
      if (data?.success) {
        console.log(data);
        dispatch(modalActions.setIsLoading(false)); // dispatch
        dispatch(modalActions.setLoadModal(true));
        dispatch(modalActions.setLoadModalMessage('')); // dispatch
      } else {
        dispatch(modalActions.setLoadModal(true));
        dispatch(modalActions.setLoadModalMessage(data.message)); // dispatch
      }
    } catch (error) {
      dispatch(modalActions.setIsLoading(false)); // dispatch
      dispatch(modalActions.setLoadModal(true)); // dispatch
      dispatch(modalActions.setLoadModalMessage(error.response.data.message)); // dispatch
      console.log(error);
    }
  };
  console.log("loadmodal" + " " + loadModal);

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
                className={`form-control mt-4 ${nameError ? "is-invalid" : ""}`}
                type="text"
                placeholder="Enter UserName"
                onChange={nameChange}
                onBlur={nameBlur}
              />
              {nameError && <span className="text-danger">{nameMessage}</span>}
            </div>
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
                Sign Up
              </button>
              <span className="text-center p-3">OR</span>
              <div className={classes.link}>
                <Link className="nav-link text-center text-white" to="/login">
                  Already have an Account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      {loadModal && loadModalMessage == "" && (
        <EmailModal
          show={loadModal}
          createUser={createUser}
          hide={() => dispatch(modalActions.setLoadModal(false))}
        />
      )}
      {loadModal && loadModalMessage != "" && (
        <MyModal
          show={loadModal}
          hide={() => dispatch(modalActions.setLoadModal(false))}
          message={loadModalMessage}
        />
      )}
    </div>
  );
};
export default Register;
