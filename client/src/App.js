import "./App.css";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Login from "./components/loginInfo/Login";
// import Register from "./components/registerInfo/Register";
// import CreateBlog from "./pages/blogsCreation/CreateBlog";
// import Home from "./components/homeInfo/Home";
// import BlogDetails from "./pages/detailedblog/BlogDetails";
// import EditBlog from "./pages/blogsEditing/EditBlog";
import { lazy, Suspense } from "react";
import MyModal from "./Modals/MyModal";
import PrivateRoute from "./customComponents/PrivateRoute";

const Home = lazy(() => import("./components/homeInfo/Home"));
const Register = lazy(() => import("./components/registerInfo/Register"));
const CreateBlog = lazy(() => import("./pages/blogsCreation/CreateBlog"));
const BlogDetails = lazy(() => import("./pages/detailedblog/BlogDetails"));
const EditBlog = lazy(() => import("./pages/blogsEditing/EditBlog"));

function App() {
  return (
    <div>
      {" "}
      <Header />
      <Routes>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Suspense fallback={MyModal}>
                <Home />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <Suspense fallback={MyModal}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <PrivateRoute>
              <Suspense fallback={MyModal}>
                <BlogDetails />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/editblogs/:id"
          element={
            <PrivateRoute>
              <Suspense fallback={MyModal}>
                <EditBlog />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path="/createblog"
          element={
            <PrivateRoute>
              <Suspense fallback={MyModal}>
                <CreateBlog />
              </Suspense>
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
