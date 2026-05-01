import './App.css';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Campaigns from './pages/Campaigns';
import Donations from './pages/Donations';

function Navigation() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) return null;

  return (
    <nav className="flex gap-4 p-4 bg-gray-100 rounded-lg mb-6 shadow-sm items-center justify-between">
      <div className="space-x-4">
        <Link to="/campaigns" className="text-blue-600 font-bold hover:underline">Campaigns</Link>
        <Link to="/donations" className="text-blue-600 font-bold hover:underline">Donations</Link>
      </div>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600"
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="max-w-4xl mx-auto pb-10 mt-6 px-4">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gray-800 tracking-tight">Helping Hands</h1>
        <Navigation />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/donations" element={<Donations />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
