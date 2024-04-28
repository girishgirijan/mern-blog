import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Project";
import Header from "./components/Header";
import FooterCom from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import CreatePost from "./pages/CreatePost";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import UpdatePost from "./pages/UpdatePost";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
}

export default App;
