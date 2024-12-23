import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import StartingPage from './components/StartingPage'


function App() {
  const [registry, setRegistry] = useState()
  return (
    <>
      <header>Schedulo - your personal reservation manager</header>
      <StartingPage></StartingPage>
    </>
  )
}

export default App
