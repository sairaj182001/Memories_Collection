import Home from "../Components/Home/Home"
import Dashboard from "../Components/Dashboard/Dashboard"
import Folder from "../Components/Folder/Folder"

const routes = [
    { path: "/", component: <Home /> },
    { path: "/dashboard", component: <Dashboard /> },
    { path: "/folder/:id", component: <Folder /> }
]

export default routes
