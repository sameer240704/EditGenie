import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { toast } from "sonner";
import { ImageEditor, LandingPage } from "./screens";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/image-editor",
    element: <ImageEditor />,
  },
]);

function App() {
  useEffect(() => {
    toast("Event has been created.");
  }, []);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
