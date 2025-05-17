import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import OpenRoute from './components/OpenRoute.jsx'
import { Dashboard } from './components/Dashboard.jsx';
import { Layout } from './layout.jsx';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './app/store.js';

import PrivateRoute from './components/PrivateRoute.jsx';
import { LoginForm } from './components/LoginForm.jsx';
import List from './pages/list.jsx';

const router = createBrowserRouter([
  {
    path: "/", element: <OpenRoute><App /></OpenRoute>,
    children: [
      { path: "/", element: <OpenRoute > <LoginForm /></OpenRoute> }
    ]
  },
  {
    path: "dashboard", element: <Layout />, children: [
      { path: "", element: <PrivateRoute><Dashboard /> </PrivateRoute> },
      { path: "list", element: <PrivateRoute><List /> </PrivateRoute> }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <Toaster position="top-center" />
    <RouterProvider router={router}>
    </RouterProvider>
  </Provider>
)
