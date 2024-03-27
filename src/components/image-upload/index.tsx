import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon } from '../icons/PlusIcon';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/src/yup.js';

import Cropper, { Area } from 'react-easy-crop'
import {Button, Image} from '@nextui-org/react';
import getCroppedImg from './crop-functions';
import { DeleteDocumentIcon } from '../icons/DeleteDocumentIcon';
import {uploadFile} from "../../_helpers/api.ts";
import axios from "axios";
import {getImageUrl} from "../../_helpers/utils.ts";

const profileFormSchema = yup.object({
  image: yup
    .mixed<File>()
    .notRequired()
    .test('fileType', 'Arquivo inválido', (file) => {
      if (!file) return true;

      const acceptedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
      return acceptedFormats.includes(file.type);
    })
    .test('fileSize', 'Tamanho limite excedido (5MB)', (file) => {
      if (!file) return true;

      return file.size <= 1024 * 1024 * 5; // 5MB
    }),
});

type ImageFormData = yup.InferType<typeof profileFormSchema>;

interface ImageUploadProps {
  setFile: (file: File | undefined) => void,
  folderName: string,
  setImageUrl?: (url: string) => void,
  actualImageUrl?: string
}

export default function ImageUpload({ setFile,folderName,setImageUrl,actualImageUrl }: ImageUploadProps) {
  const {
    register,
    reset,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ImageFormData>({
    resolver: yupResolver(profileFormSchema),
    mode: 'onChange',
  });

  const [isCroppingImage, setIsCroppingImage] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [type, setType] = useState("")


  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const saveCroppedImage = async () => {
    if (!imagePreview || !croppedAreaPixels) return;

    try {
      const croppedImage = await getCroppedImg(
        imagePreview,
        croppedAreaPixels
      )

      setImagePreview(String(croppedImage.url));
      //const extension = type.split('/')[1];
      const fileName = `${new Date().getTime()}`;
      setIsCroppingImage(false);

      // const config = { responseType: 'file' };
      // const req = await axios.get(croppedImage.url, config);

      const reader = new FileReader();
      reader.readAsDataURL(croppedImage.file);
      reader.onloadend =async () => {
        const fd = new FormData();
        fd.append('file', reader.result);
        const result = await uploadFile(folderName,fileName, fd);
        if (result.statusCode===201) {
          if (setImageUrl) {
            setImageUrl(result.imageUrl ? result.imageUrl : "");
          }
        }
      }

    } catch (e) {
      console.error(e)
    }
  }

  const handleRemoveImage = () => {
    setFile(undefined)
    setImagePreview(null)
  }

  async function handleInputFileChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const file = files.item(0);
    setType(file?.type);
    if (file) {
      reset(
        {
          ...getValues(),
          image: undefined,
        },
        { keepErrors: true },
      );

      register('image', {
        value: file,
      });

      await trigger('image');

      const reader = new FileReader();

      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsCroppingImage(true);
    } else {
      register('image', {
        value: undefined,
      });
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 relative">
        <label className="w-52 h-[138px] rounded-2xl overflow-hidden bg-gradient-to-r from-[#8ED5A0] to-[#E6CC73] p-1 cursor-pointer">
          <div className="rounded-xl overflow-hidden flex justify-center items-center bg-white h-full w-full">
            {!actualImageUrl || isCroppingImage || <Image src={getImageUrl(folderName,actualImageUrl)}></Image>}
            {!imagePreview && !actualImageUrl && <PlusIcon className="w-16 h-16 text-gray-300" />}
            <input
              type="file"
              accept="image/jpg, image/jpeg, image/png"
              onChange={handleInputFileChange}
              className="hidden"
            />

            {!errors.image && imagePreview && (
              <img src={imagePreview} alt="Imagem" className="w-full h-full object-cover" />
            )}

          </div>
        </label>

        {isCroppingImage && imagePreview && (
          <div className="flex flex-col">
            <Cropper
              image={imagePreview}
              crop={crop}
              zoom={zoom}
              aspect={16 / 9}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              style={{ containerStyle: { background: 'white' } }}
            />
            <Button className="z-10 border-none absolute bottom-[2px] right-[calc(50%-40px)] h-8" color='primary' onClick={saveCroppedImage}>Cortar</Button>
          </div>
        )}

        {errors.image ? (
          <span className="mt-4 text-sm text-red-400 text-center">Escolha uma imagem válida jpg, jpeg ou png (opcional)</span>
        ) : (
          <>
            {imagePreview ? (
              <button
                className="
                  flex items-center gap-2 mt-2 text-sm text-center transition-all
                  text-red-400 bg-none border-none hover:text-red-300"
                onClick={handleRemoveImage}
              >
                Remover
                <DeleteDocumentIcon />
              </button>
            ) : (
              <span className="mt-4 text-sm text-center">Escolha a imagem (opcional)</span>
            )}
          </>
        )}
      </div>
    </>
  );
}