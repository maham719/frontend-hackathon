import { RouterProvider } from "react-router-dom";
import {router} from "./app.routes.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./features/auth/services/authContext.jsx";



function App() {

  return (
<ThemeProvider>
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>

</ThemeProvider>
  )
}

export default App
