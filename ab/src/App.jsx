import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Register from './pages/register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'


function App() {
  // need to add more routes on by on e
  // timeytable at dahboard
  // profile
  //internal marks
  //od/leave submission
  
 ///
 /////
 /////////

  return (

    <>
    <Router>
  <Routes>
      <Route  path='/signup' element={<Register/> }  />
      <Route  path='/login' element = {<Login/>}    />
      <Route  path='/dashboard' element={ <Dashboard/>}    />
  </Routes>
    </Router>

    </>
     
  )
}

export default App
