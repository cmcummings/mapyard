import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BuildPage from "./pages/BuildPage";
import SplashPage from "./pages/SplashPage";
import UserPage from "./pages/UserPage";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />
  },
  {
    path: "build",
    element: <BuildPage />
  },
  {
    path: "user",
    element: <UserPage />
  }
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App
