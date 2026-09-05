import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import AdminServices from "./pages/AdminServices";
import AdminEmployees from "./pages/AdminEmployees";
import BookingPage from "./pages/BookingPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/dashboard" element={<ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>}/>
          <Route path="/admin/services" element=
          {<ProtectedRoute requireAdmin>
              <AdminServices/>
            </ProtectedRoute>}/>
          <Route path="/admin/employees" element=
          {<ProtectedRoute requireAdmin>
              <AdminEmployees/>
            </ProtectedRoute>}/>
          <Route path="/bookings" element={
            <ProtectedRoute>
              <BookingPage/>
            </ProtectedRoute>
          }/>
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookingsPage/>
            </ProtectedRoute>
          }/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;