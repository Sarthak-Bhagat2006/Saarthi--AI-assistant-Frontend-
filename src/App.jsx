// App.jsx
import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import Home from "./Components/Home/Home";
import NotFound from "./Components/Home/NotFound";
import Register from "./Components/Register/Register";
import VerifyEmail from "./Components/Register/VerifyEmail";
import ResetPassword from "./Components/Register/ResetPassword";
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
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MyProvider>
  );
}

export default App;
