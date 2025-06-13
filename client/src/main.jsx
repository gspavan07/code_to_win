import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { DeptProvider } from "./context/MetaContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <DeptProvider>
      <App />
    </DeptProvider>
  </AuthProvider>
);
