import React, { useState } from 'react'
import './App.css'
import LockScreen from './components/LockScreen'
import Dashboard from './components/Dashboard'

export default function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [password, setPassword] = useState(null)

  function handleUnlock(pw) {
    setPassword(pw)
    setUnlocked(true)
  }

  function handleLock() {
    setPassword(null)
    setUnlocked(false)
  }

  return (
    <div>
      {unlocked ? <Dashboard password={password} onLock={handleLock} /> : <LockScreen onUnlock={handleUnlock} />}
    </div>
  )
}
