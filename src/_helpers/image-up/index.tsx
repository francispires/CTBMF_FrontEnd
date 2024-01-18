import React from "react";
import ReactCrop, { type Crop } from 'react-image-crop'
import {useState} from "react";
import {Image} from "@nextui-org/react";


export type ImageUpProps = {
    src: string;
}
export const  ImageUp = ( props:ImageUpProps ) =>{
    const [crop, setCrop] = useState<Crop>();

    return(
        <ReactCrop crop={crop} onChange={c => setCrop(c)}>
            <Image src={props.src} />
        </ReactCrop>
    )
}