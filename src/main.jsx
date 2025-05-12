import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import App from './App.jsx'
import './index.css'

// Create projects slice
const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [
      { id: '1', name: 'Personal', color: 'blue' },
      { id: '2', name: 'Work', color: 'green' },
      { id: '3', name: 'Education', color: 'purple' },
      { id: '4', name: 'Home Improvement', color: 'amber' }
    ]
  },
  reducers: {
    addProject: (state, action) => {
      state.list.push(action.payload)
    },
    updateProject: (state, action) => {
      const index = state.list.findIndex(project => project.id === action.payload.id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
    },
    deleteProject: (state, action) => {
      state.list = state.list.filter(project => project.id !== action.payload)
    }
  }
})

// Create store
const store = configureStore({
  reducer: {
    projects: projectsSlice.reducer
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)