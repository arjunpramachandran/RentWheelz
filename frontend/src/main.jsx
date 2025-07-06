import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'

import router from './routes/AppRoutes'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'




const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>

    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>

  </Provider>,
)