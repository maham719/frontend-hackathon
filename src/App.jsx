import { RouterProvider } from "react-router-dom";
import {router} from "./app.routes.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./features/auth/services/authContext.jsx";
import { TicketProvider } from "./features/tickets/context/TicketContext.jsx";



function App() {

  return (
<ThemeProvider>
<AuthProvider>
  <TicketProvider>
  <RouterProvider router={router} />
  </TicketProvider>
</AuthProvider>

</ThemeProvider>
  )
}

export default App
