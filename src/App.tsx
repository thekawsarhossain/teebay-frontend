import "./styles/global.css";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import EditProduct from "./pages/editProduct";
import CreateProduct from "./pages/createProduct";
import PrivateRoute from "./Components/PrivateRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AllProducts from "./pages/allProducts";
import ProductDetails from "./pages/productDetails";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute> <AllProducts /> </PrivateRoute>} />
        <Route path="/product/:productId" element={<PrivateRoute> <ProductDetails /> </PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
        <Route path="/create-product" element={<PrivateRoute> <CreateProduct /> </PrivateRoute>} />
        <Route path="/edit-product/:productId" element={<PrivateRoute> <EditProduct /> </PrivateRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;