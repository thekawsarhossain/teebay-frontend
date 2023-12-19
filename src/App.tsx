import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./styles/global.css";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;