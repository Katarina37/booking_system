import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;