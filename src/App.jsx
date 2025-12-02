// App.jsx
import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import { MyProvider } from "./Context/MyContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <MyProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
}

export default App;
