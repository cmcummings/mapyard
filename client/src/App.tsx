import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import BuildPage from "./pages/BuildPage";
import LoginPage from "./pages/LoginPage";
import SplashPage from "./pages/SplashPage";
import UserPage from "./pages/UserPage";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashPage />
  },
  {
    path: "build/:id",
    element: <BuildPage />
  },
  {
    path: "user",
    element: <UserPage />
  },
  {
    path: "login",
    element: <LoginPage />
  }
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

export default App
