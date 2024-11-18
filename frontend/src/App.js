import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Editor from './components/editor/Editor';
import Home from './components/homePage/home';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>,
  },
  {
    path: "/editor/:roomId" ,
    element: <Editor/>
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;