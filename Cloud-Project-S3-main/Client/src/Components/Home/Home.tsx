import "./Home.css"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"

const Home: React.FC = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    useEffect(() => {
        if (isAuthenticated) window.location.href = "/dashboard"
    }, [isAuthenticated])

    return (
        <div className="Home">
            <div>
                <h2>Storage Collections</h2>
                <button className="btn btn-dark btn-sm" onClick={() => loginWithRedirect()}>SignIn / SignUp</button>
            </div>
        </div>
    )
}

export default Home