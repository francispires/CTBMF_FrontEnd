import {uploadFile} from "../api.ts";

const upload = (url:string,file: File, name:string,folder:string, onUploadProgress: any): Promise<any> => {
    const formData = new FormData();

    formData.append("file", file);

    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL;

    return uploadFile(`${apiUrl}/${url}?fileName=${name}&folderName=${folder}`, formData,onUploadProgress);
};

const FileUploadService = {
    upload
};

export default FileUploadService;