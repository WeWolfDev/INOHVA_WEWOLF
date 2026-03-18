import { Outlet } from "react-router";
import { ERPProvider } from "../../context/ERPContext";

export function RootLayout() {
  return (
    <ERPProvider>
      <Outlet />
    </ERPProvider>
  );
}
