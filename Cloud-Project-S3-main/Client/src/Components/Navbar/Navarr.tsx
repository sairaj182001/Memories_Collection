import "./Navbarr.css"
import { useAuth0 } from "@auth0/auth0-react"
import { Avatar } from "@material-ui/core"
import { Nav } from "react-bootstrap"
import FolderModal from "../Modals/FolderModal"
import UploadModal from "../Modals/UploadModal"

const Navbarr: React.FC = () => {
    const { isAuthenticated, isLoading, user, logout, loginWithRedirect } = useAuth0();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container container-fluid">
                <a className="navbar-brand" href="/">Collections</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
                    aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" style={{ justifyContent: "end" }} id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        {isAuthenticated && <a className="nav-link" href="/dashboard">Dashboard</a>}
                        {isAuthenticated && <FolderModal />}
                        {isAuthenticated && <UploadModal />}
                        {isLoading
                            ? <div style={{ display: "flex", alignItems: "center", marginLeft: "5px" }}>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                            : isAuthenticated
                                ? <>
                                    <Nav.Link style={{ padding: 0 }}>
                                        <Avatar alt={user?.name} src={user?.picture}>{user?.name?.charAt(0)}</Avatar>
                                    </Nav.Link>
                                    <Nav.Link>
                                        <button className="btn btn-dark btn-sm" onClick={() => logout({ returnTo: window.location.origin })}>LOG OUT</button>
                                    </Nav.Link>
                                </>
                                : <Nav.Link href="/auth">
                                    <button className="btn btn-dark btn-sm" onClick={() => loginWithRedirect()}>Sign In</button>
                                </Nav.Link>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbarr