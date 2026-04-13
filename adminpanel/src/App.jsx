import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Login from "./auth/Login";
import RequireAuth from "./auth/RequireAuth";
import Unauthorized from "./auth/Unauthorized";

function App() {
  return (
    <BrowserRouter>  
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected layout */}
        <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>

          <Route 
            path="/" 
            element={<RequireAuth allowedRoles={['Admin','Manager','User']}><Dashboard /></RequireAuth>} 
          />
          <Route 
            path="/users" 
            element={<RequireAuth allowedRoles={['Admin','Manager']}><Users /></RequireAuth>} 
          />
          <Route 
            path="/settings" 
            element={<RequireAuth allowedRoles={['Admin']}><Settings /></RequireAuth>} 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
