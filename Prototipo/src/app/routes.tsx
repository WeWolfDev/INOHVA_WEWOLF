import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { Compras } from "./pages/Compras";
import { Produccion } from "./pages/Produccion";
import { Administracion } from "./pages/Administracion";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <Administracion /> },
          { path: "compras", element: <Compras /> },
          { path: "produccion", element: <Produccion /> },
          { path: "administracion", element: <Administracion /> },
        ],
      },
    ],
  },
]);
