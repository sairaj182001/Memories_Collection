import { Modal, Button, Spinner } from "react-bootstrap"
import { useState } from "react"
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react"

type props = {
    folderId: string
}

const Delete: React.FC<props> = ({ folderId }) => {
    const [show, setShow] = useState(false)
    const [spin, setSpin] = useState(false)

    const { getAccessTokenSilently, user } = useAuth0()
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const handleDelete = async () => {
        setSpin(true)
        const token = await getAccessTokenSilently()

        axios({
            method: "POST",
            url: "/delete-folder",
            headers: {
                "authorization": `Bearer ${token}`
            },
            data: { folderId, userId: user?.sub }
        })
            .then(() => {
                handleClose()
                setSpin(false)
                window.location.reload()
            })
            .catch(error => console.log(error.response.data))
    }

    return (
        <>
            <Button className="popover-btn" onClick={handleShow}>Delete</Button>

            <Modal show={show} onHide={handleClose} keyboard={false} backdrop="static">
                <Modal.Body>
                    Are you sure? You want to delete.
                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" onClick={handleClose} variant="secondary">Close</Button>
                    <Button size="sm" onClick={handleDelete} variant="danger" disabled={spin}>
                        {!spin
                            ? "Delete"
                            : <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                &nbsp;
                                Deleting...
                            </>
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Delete