import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import {store} from './app/store'

import router from './routes/AppRoutes'
import { RouterProvider } from 'react-router-dom'




const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    
      <RouterProvider router={router} />
    
  </Provider>,
)