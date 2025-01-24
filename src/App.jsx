import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Request from './components/requestPage'
import RequestsList from './components/requestList';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {


  return (
    <>
   <Router>
      <Routes>
        <Route path="/requests" element={<Request />} />
        <Route path="/lists" element={<RequestsList />} />
       
      </Routes>
    </Router>
    </>
  )
}

export default App
