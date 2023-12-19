import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./styles/global.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import PrivateRoute from "./Components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;