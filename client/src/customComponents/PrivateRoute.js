import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  console.log('islogin',isLogin)
  return <>{isLogin ? <>{children}</> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;
