import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import ActivityRegisterInstanceScreen from "./app/activityRegisterInstance/activityRegisterInstanceScreen";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ActivityRegisterEditor from "./app/activityRegisterInstance/views/activityRegister/activityRegisterEditor";

export const darkTheme = createTheme({
  palette: {
    mode: "dark"
  }
})
export const lightTheme = createTheme({
  palette: {
    mode: "light"
  }
})

export const styleTheme = lightTheme

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/instance/:id",
    element: <ActivityRegisterInstanceScreen />
  },
  {
    path : "/instance/activityRegister/:instanceId/:registerId",
    element : <ActivityRegisterEditor/>
  }
])

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider theme={styleTheme}>
    <UserProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </UserProvider>
  </ThemeProvider>
)