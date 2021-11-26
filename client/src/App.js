import "./App.css";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Login } from "./pages/login/Login";
import { Register } from "./pages/register/Register";
import { Home } from "./pages/home/Home";
import { Profile } from "./pages/profile/Profile";
import { Search } from "./pages/search/Search";
import { ConversationPage } from "./pages/conversation/ConversationPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        {/*  Sets up routes and redirects if user is not logged in by check local storage  */}
        <Route exact path="/" element={user ? <Home /> : <Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />
        <Route path="/search" element={user ? <Search /> : <Login />} />
        <Route
          path="/conversation/:conversationId"
          element={user ? <ConversationPage /> : <Login />}
        />
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate replace to="/" /> : <Register />}
        />
      </Routes>
    </Router>
  );
}

export default App;
