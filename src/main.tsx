import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext";
import ActivityRegisterInstanceScreen from "./app/instance/registerActivity/activityRegisterInstanceScreen";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

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
    path: "/instance/registerActivity/:id",
    element: <ActivityRegisterInstanceScreen />
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