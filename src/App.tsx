import { RouterProvider } from "@tanstack/react-router";
import { FC } from "react";
import { router } from "./routes";

const App: FC = () => {
    return <RouterProvider router={router} />
}

export default App;