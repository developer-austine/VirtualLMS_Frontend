import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import globalState from './Redux-Toolkit/globalState.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={globalState}>
      <App />
    </Provider>
  </StrictMode>,
)
