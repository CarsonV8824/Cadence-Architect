import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import NavBar from "./componets/navbar"
import Home from "./pages/home"
import Generate from "./pages/generate"

function App() {

  return (
    <Router>
      <div className="bg-indigo-950 min-h-screen">
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
