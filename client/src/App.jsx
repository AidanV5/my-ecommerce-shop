import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import Reviews from './pages/Reviews';
import Wishlist from './pages/Wishlist';
import Trending from './pages/Trending';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/orders" element={<AdminOrders />} />
            <Route path="/product/:productId/reviews" element={<Reviews />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/trending" element={<Trending />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
