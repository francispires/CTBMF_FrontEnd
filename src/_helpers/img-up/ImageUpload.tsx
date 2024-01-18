import React, {useRef, useState} from "react";
import FileUploadService from "./FileUploadService.ts";
import {Image} from "@nextui-org/react";

interface ImageUploadProps {
    upUrl: string;
    currentUrl: string;
    id: string;
    name: string;
    folder:string;
}

export const ImageUpload = (props: ImageUploadProps) => {
    const [currentImage, setCurrentImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState<string>("");
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);


    const handleUpload = () => {
        inputRef.current?.click();
    };
    const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files as FileList;
        setCurrentImage(selectedFiles?.[0]);
        setPreviewImage(URL.createObjectURL(selectedFiles?.[0]));
        setProgress(0 || progress);
        !Date.now() && upload();
    }

    const upload = () => {
        setProgress(0);
        if (!currentImage) return;

        FileUploadService.upload(props.upUrl, currentImage,props.name,props.folder, (event: ProgressEvent) => {            setProgress(Math.round((100 * event.loaded) / event.total));

        }).then((response) => {
            setMessage(response.data.message);
            response.data.message;
        }).catch(() => {
            setProgress(0);
            setMessage("Houve um erro!" || message);
            setCurrentImage(undefined);
        });
    }

    return (
        <>
            {previewImage && (
                <div style={{ cursor: "pointer" }} onClick={handleUpload}>
                    <Image
                        width="100%"
                        height={200}
                        alt=""
                        src={previewImage}
                    />
                </div>
            )}
            {!previewImage && (
                <div style={{ cursor: "pointer" }} onClick={handleUpload}>
                    <Image
                        width="100%"
                        height={200}
                        alt=""
                        src="/img/add-image-placeholder.svg"
                    />
                </div>
            )}
            <input hidden={true} ref={inputRef} type="file" accept="image/*" onChange={selectImage} />
        </>
    )
}