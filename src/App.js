import Login from "./Pages/Login";
import Home from "./Pages/Home";
import NoPage from "./Pages/NoPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useGlobalAuthContext } from "./Context";
import Registration from "./Pages/Registration";

function App() {
  const { currentUser } = useGlobalAuthContext();
  // console.log("user from app.js",currentUser);
    const ProtectedRoute = ({ children }) => {
      if (!currentUser) {
        return <Navigate to="/login" />;
      }
      return children;
    };
  

  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
