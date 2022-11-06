import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"
import type { Data } from "../../Types/data"

const Folder: React.FC = () => {
    const [imageFiles, setImageFiles] = useState<Data[]>([])
    const [videoFiles, setVideoFiles] = useState<Data[]>([])

    const { isLoading, user, getAccessTokenSilently } = useAuth0()
    useEffect(() => {
        const getFiles = async () => {
            const token = await getAccessTokenSilently()
            const folderId = window.location.pathname.slice(8)

            axios({
                method: "GET",
                url: `/get-files?userId=${user?.sub}&folderId=${folderId}`,
                headers: {
                    "authorization": `Bearer ${token}`
                }
            })
                .then(res => {
                    res.data.files.forEach((file: Data) => {
                        const extension = file.src.split('.')[5]
                        if (extension !== "mp4") setImageFiles(prevImages => [...prevImages, file])
                        else setVideoFiles(prevVideos => [...prevVideos, file])
                    })
                })
                .catch(error => console.log(error.response.data))
        }

        if (!isLoading) getFiles()
    }, [getAccessTokenSilently, isLoading, user?.sub])

    return (
        <div className="container">
            {!imageFiles.length
                ? <div className="col">
                    <p>You can upload your files here...</p>
                </div>
                : <>
                    <div className="row">
                        {!imageFiles.length
                            ? null
                            : <>
                                <h5 style={{ textAlign: "left" }}>Images</h5>
                                {imageFiles.map((image: Data, ind) => {
                                    return (
                                        <div className="col-3 my-2" key={ind}>
                                            <a href={image.src + "?force=true"} download>
                                                <img src={image.src} alt={image.fileName} width={250} height={250} style={{ borderRadius: "10px" }} />
                                            </a>
                                        </div>
                                    )
                                })}
                            </>
                        }
                    </div>
                    <br />

                    <div className="row">
                        {!videoFiles.length
                            ? null
                            : <>
                                <h5 style={{ textAlign: "left" }}>Videos</h5>
                                {videoFiles.map((video: Data, ind) => {
                                    return (
                                        <div className="col-4 my-2" key={ind}>
                                            <video controls width={300} style={{ borderRadius: "5px" }}>
                                                <source src={video.src} />
                                            </video>
                                        </div>
                                    )
                                })}
                            </>
                        }

                    </div>
                </>
            }
        </div>
    )
}

export default Folder
