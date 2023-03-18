import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import BuildPage from "./pages/BuildPage";
import UserPage from "./pages/UserPage";
import store from "./redux/store";

const router = createBrowserRouter([
  {
    path: "/",
    element:  localStorage.getItem("username") ? <UserPage /> : <AuthPage />
  },
  {
    path: "build/:id",
    element: <BuildPage />
  },
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
