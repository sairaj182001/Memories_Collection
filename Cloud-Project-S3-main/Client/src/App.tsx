import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import routes from "./Routes/routes"
import Navbarr from "./Components/Navbar/Navarr"

function App() {
  return (
    <div className="App">
      <Navbarr />
      <Router>
        <Routes>
          {routes.map((route, ind) => {
            return (
              <Route key={ind} path={route.path} element={route.component} />
            )
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
