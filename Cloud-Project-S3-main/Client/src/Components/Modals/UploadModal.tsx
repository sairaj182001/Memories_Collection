import { useState, useEffect } from "react"
import { Modal, Form, Button, Spinner, FloatingLabel } from "react-bootstrap"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"

const UploadModal: React.FC = () => {
    const [show, setShow] = useState(false)
    const [spin, setSpin] = useState(false)
    const [file, setFile] = useState<File>()
    const [folders, setFolders] = useState<any[]>([])
    const [folderName, setFolderName] = useState("")

    const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0()

    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

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

    const handleFilesUpload = async () => {
        if (!isAuthenticated) {
            alert("You need to loginIn to upload files")
            return
        }
        if (!file) {
            alert("Upload any file...")
            return
        }
        const isContains: Boolean = window.location.pathname.includes("folder")
        if (!isContains && !folderName) {
            alert("Enter Folder Name to store your file...")
            return
        }
        const mimeTypes = ["video/mp4", "image/png", "image/jpg", "image/jpeg"]
        if (!mimeTypes.includes(file.type)) {
            alert("The supported formats are .mp4, .jpg, .png, .jpeg")
            return
        }

        let _folder, folderId
        if (window.location.pathname.includes("folder")) folderId = window.location.pathname.slice(8)
        else {
            _folder = folders.find(folder => folder.folderName === folderName)
            if (!_folder) {
                alert("Their is no folder with this name.")
                return
            }
        }

        setSpin(true)
        const token = await getAccessTokenSilently()

        const formData = new FormData()
        formData.append("id", user?.sub!)
        formData.append("file", file)
        formData.append("folderId", folderId || _folder._id)

        axios({
            method: "POST",
            url: "/upload-file",
            headers: {
                "authorization": `Bearer ${token}`,
                'Content-Type': `multipart/form-data; boundary="mern-memory"`
            },
            data: formData
        })
            .then((res) => {
                handleClose()
                setSpin(false)
                window.location.href = `/folder/${res.data.fid}`
            })
            .catch(error => {
                console.log(error.response.data)
                handleClose()
                setSpin(false)
                alert(error.response.data.message)
            })
    }

    return (
        <>
            <Button onClick={handleShow} id="upload">Upload</Button>

            <Modal show={show} onHide={handleClose} keyboard={false} backdrop="static">
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Images or Videos</Form.Label>
                        {!window.location.pathname.includes("folder") &&
                            <FloatingLabel controlId="floatingInput" label="Folder Name">
                                <Form.Control type="text"
                                    placeholder="Enter Folder Name..."
                                    onChange={e => setFolderName(e.target.value)}
                                    list="folders"
                                />
                                <datalist id="folders">
                                    {folders.map((folder, ind) => <option key={ind} value={folder.folderName} />)}
                                </datalist>
                            </FloatingLabel>
                        }
                        <div className="my-3">
                            <input className="form-control" type="file"
                                id="file"
                                accept=".png, .jpg, .jpeg, .mp4"
                                onChange={e => setFile((e.target.files as FileList)[0])}
                            />
                        </div>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" onClick={handleClose} variant="secondary">Close</Button>
                    <Button size="sm" onClick={handleFilesUpload} variant="success" disabled={spin}>
                        {!spin
                            ? "Upload"
                            : <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                &nbsp;
                                Uploading...
                            </>
                        }
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UploadModal
