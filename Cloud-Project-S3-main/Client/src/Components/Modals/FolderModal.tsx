import { useState } from "react"
import { Modal, Button, Form, FloatingLabel, Spinner } from "react-bootstrap"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"

const FolderModal: React.FC = () => {
    const [show, setShow] = useState(false)
    const [spin, setSpin] = useState(false)
    const [folderName, setFolderName] = useState("")
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0()

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleFolderCreation = async () => {
        if (!isAuthenticated) {
            alert("You need to be loggedIn to create any folder")
            return
        }
        if (!folderName) {
            alert("Enter any name to create a folder")
            return
        }

        setSpin(true)
        const token = await getAccessTokenSilently()
        const data = { folderName, id: user?.sub }

        axios({
            method: "POST",
            url: "/create-new-folder",
            headers: {
                "authorization": `Bearer ${token}`
            },
            data
        })
            .then(res => {
                handleClose()
                setSpin(false)
                window.location.reload()
            })
            .catch(error => console.log(error.response.data))
    }

    return (
        <>
            <Button onClick={handleShow} id="folder"> New Folder </Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Create New Folder</Form.Label>
                        <FloatingLabel controlId="floatingInput" label="Folder Name">
                            <Form.Control type="text" placeholder="Create New Folder..." onChange={e => setFolderName(e.target.value)} />
                        </FloatingLabel>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose} size="sm"> Close </Button>
                    <Button variant="primary" onClick={handleFolderCreation} size="sm" disabled={spin}>
                        {!spin
                            ? "Create"
                            : <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                &nbsp;
                                Creating...
                            </>
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default FolderModal