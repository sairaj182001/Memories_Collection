import "./Dashboard.css"
import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import type { Data } from "../../Types/data"
import { MoreVert, Folder } from '@material-ui/icons';
import { Popover, OverlayTrigger, Button } from "react-bootstrap"
import Delete from "../Modals/Delete"

const Dashboard: React.FC = () => {
    const [folders, setFolders] = useState<any[]>([])
    const [name, setName] = useState("")
    const [showInput, setShowInput] = useState(false)

    const { isAuthenticated, isLoading, user, error, loginWithRedirect, getAccessTokenSilently } = useAuth0();
    const navigate = useNavigate()

    useEffect(() => {
        if (error) {
            alert(error.message)
            window.location.search = ""
        }
        else if (isAuthenticated && user) {
            axios.post("/update-user-details", { user })
                .then((res) => console.log(res.data.message))
                .catch(err => console.log(err.response))
        }
    }, [error, isAuthenticated, user])

    useEffect(() => {
        const getFolders = async () => {
            const token = await getAccessTokenSilently()

            axios({
                method: "GET",
                url: `/get-folders?userId=${user?.sub}`,
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })
                .then(res => setFolders(res.data.folders))
                .catch(error => console.log(error.response.data))
        }

        if (!isLoading) getFolders()
    }, [getAccessTokenSilently, isLoading, user?.sub])

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        loginWithRedirect()
    }

    const redirectTo = (id: String, files: Data[]) => {
        navigate(`/folder/${id}`, {
            state: files
        })
    }

    const settings = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleChange = async (e: any, folderId: string) => {
        if (e.key === 'Enter') {
            const token = await getAccessTokenSilently()
            const data = { name, userId: user?.sub, folderId }

            axios({
                method: "POST",
                url: "/change-folder-name",
                headers: {
                    "authorization": `Bearer ${token}`
                },
                data
            })
                .then(() => {
                    folders.forEach(folder => {
                        if (folder._id === folderId) folder.folderName = name
                    })
                    setShowInput(false)
                })
                .catch(error => console.log(error.response.data))
        }
    }

    return (
        <>
            {!isAuthenticated
                ? <div>
                    <div style={{ marginTop: "20%" }} >
                        <p>Redirecting to login page...</p>
                    </div>
                </div>
                : <div className="container">
                    <div className="row">
                        {!folders.length
                            ? <div className="col">
                                <p>Create folders to upload any new files...</p>
                            </div>
                            : folders.map((folder, ind) => {
                                return (
                                    <div className="col-4 my-3" key={ind}>
                                        <div className="card">
                                            <div className="card-body" onClick={() => redirectTo(folder?._id, folder.files)}>
                                                <h5 className="card-title">
                                                    <div className="combo">
                                                        <Folder /> {folder?.folderName}
                                                    </div>
                                                    <OverlayTrigger
                                                        trigger="click"
                                                        placement="auto"
                                                        rootClose
                                                        overlay={
                                                            <Popover id="popover-basic">
                                                                <Popover.Body onClick={(e: any) => settings(e)}>
                                                                    <Button size="sm" className="popover-btn" onClick={() => setShowInput(!showInput)}>Rename</Button><br />
                                                                    {showInput &&
                                                                        <>
                                                                            <input type="text" placeholder="Enter Name"
                                                                                onChange={e => setName(e.target.value)}
                                                                                onKeyDown={(e) => handleChange(e, folder._id)} />
                                                                            <br />
                                                                        </>
                                                                    }
                                                                    <Delete folderId={folder._id} />
                                                                </Popover.Body>
                                                            </Popover>
                                                        }
                                                    >
                                                        <MoreVert onClick={(e) => settings(e)} />
                                                    </OverlayTrigger>
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default Dashboard
