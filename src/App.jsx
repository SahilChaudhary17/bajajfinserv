import { useState } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import "./App.css";

import Home from "./components/Home/Home";

function App() {
  const route = createBrowserRouter(
    createRoutesFromElements(<Route path="/" element={<Home />}></Route>)
  );

  return <RouterProvider router={route} />;
}

export default App;
