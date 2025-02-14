import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/register.jsx'
import Login from './pages/Login.jsx'

function App() {


  return (

    <>
    <Router>
  <Routes>
      <Route  path='/' element={<Register/> }  />
      <Route  path='/login' element = {<Login/>}    />
  </Routes>
    </Router>

    </>
     
  )
}

export default App
