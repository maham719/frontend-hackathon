import { RouterProvider } from "react-router-dom";
import {router} from "./app.routes.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./features/auth/context/authContext.jsx";
import { TicketProvider } from "./features/tickets/context/TicketContext.jsx";
import { NotificationProvider } from "./features/notifications/context/NotificationContext.jsx";




function App() {

  return (
<ThemeProvider>
<AuthProvider>
 <NotificationProvider>
  <TicketProvider>
   <RouterProvider router={router} />
  </TicketProvider>
 </NotificationProvider>
 
</AuthProvider>

</ThemeProvider>
  )
}

export default App
