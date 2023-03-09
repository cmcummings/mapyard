import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BuildPage from "./pages/BuildPage";
import SplashPage from "./pages/SplashPage";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />
  },
  {
    path: "build",
    element: <BuildPage />
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
