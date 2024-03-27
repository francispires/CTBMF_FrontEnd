import {useAuth0} from "@auth0/auth0-react";
import {useEffect, useState} from "react";
import {PageLayout} from "../components/page-layout.jsx";
import {Button, Input, Spinner} from "@nextui-org/react";
import {useQuery} from "@tanstack/react-query";
import {getMe, patch} from "../_helpers/api.ts";
import {PageLoader} from "../components/page-loader.tsx";
import ImageUpload from "../components/image-upload/index.tsx";
import {FaArrowLeft} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/src/yup.ts";
import {apiUrl,getImageUrl} from "../_helpers/utils.ts";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {date, object, string} from "yup";
import * as yup from "yup";

const editSchema = object().shape({
    name: string().nullable(),
    address: string().nullable(),
    birthDay: date().min(new Date(1900, 1, 1), 'Data de nascimento inválida').max(new Date(), 'Data de nascimento inválida'),
    Email:string().nullable(),
    phoneNumber: string().nullable(),
    image: string().nullable(),
});

type EditSchema = yup.InferType<typeof editSchema>;

export const ProfilePage = () => {

    const {user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [, setUserMetadata] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [, setFile] = useState<File>();
    const [saving, setSaving] = useState(false);
    const navigation = useNavigate();
    const {
        register,
        handleSubmit,

        formState: { errors }
    } = useForm<EditSchema>({
        resolver: yupResolver(editSchema)
    });

    useEffect(() => {
        const getUserMetadata = async () => {
            const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN;
            try {
                const accessToken = await getAccessTokenSilently({
                    authorizationParams: {
                        audience: `https://${domain}/api/v2/`,
                        scope: "read:current_user",
                    },
                });

                const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user?.sub}`;

                const metadataResponse = await fetch(userDetailsByIdUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                const {user_metadata} = await metadataResponse.json();

                setUserMetadata(user_metadata);
            } catch (e) {
                console.log(e);
            }
        };
        getUserMetadata();
    }, [getAccessTokenSilently, user?.sub]);


    const {isLoading, isError, data: me} = useQuery({
        queryKey: ['getme'],
        queryFn: getMe,
    });

    const handleBack = () => {
        navigation('/')
    }

    const onSubmit = async (data:EditSchema) => {
        setSaving(true);
        imageUrl && (data.image = getImageUrl("users",imageUrl));
        try {
            const response = await patch(`${apiUrl}/users/me`, data);
            if (response.status === 200) {
                toast.success("Dados atualizados com sucesso");
            }
        } catch (e) {
            toast.error("Erro ao atualizar dados");
        } finally {
            setSaving(false);
            await getAccessTokenSilently();
        }
    }

    if (isLoading) {
        return <PageLoader/>;
    }
    if (isError) {
        return <>Erro!</>
    }

    if (!isAuthenticated) {
        return (
            <PageLayout>
                <div className="content-layout">
                    <h1 id="page-title" className="content__title">
                        Meus Dados
                    </h1>
                    <div className="content__body">
                        <p id="page-description">
                            Faça login para ver seus dados
                        </p>
                    </div>
                </div>
            </PageLayout>
        );
    }

    if (!user) {
        return null;
    }
    return (
        <div>
            <Button variant="ghost" className="mb-6" onClick={handleBack}><FaArrowLeft/> Voltar</Button>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
            >
                <ImageUpload setFile={setFile} setImageUrl={setImageUrl} folderName={"users"} actualImageUrl={me?.image}/>

                <Input {...register("name")} label="Nome" variant="bordered" defaultValue={me?.name}/>
                {errors.name && <cite className={"text-danger"}>{errors.name.message}</cite>}

                <Input {...register("address")} label="Endereço" variant="bordered" defaultValue={me?.address}/>
                {errors.address && <cite className={"text-danger"}>{errors.address.message}</cite>}

                <Input {...register("birthDay")} label="Nascimento" variant="bordered" type={"date"}
                       defaultValue={me?.birthDay ? new Date(me.birthDay).toISOString().slice(0,10):""}
                />
                {errors.birthDay && <cite className={"text-danger"}>{errors.birthDay.message}</cite>}

                <Input {...register("Email")} label="E-mail" variant="bordered" defaultValue={me?.email}/>
                {errors.Email && <cite className={"text-danger"}>{errors.Email.message}</cite>}

                <Input {...register("phoneNumber")} label="Celular" variant="bordered" defaultValue={me?.phoneNumber}/>
                {errors.phoneNumber && <cite className={"text-danger"}>{errors.phoneNumber.message}</cite>}

                <Button
                    type={"submit"}
                    color="primary"
                    className="my-6 mx-auto max-w-[150px] w-full"
                    disabled={saving}
                >
                    {saving ? (
                        <Spinner size="sm" color="white"/>
                    ) : (
                        <span>Salvar</span>
                    )}
                </Button>
            </form>
        </div>
    );
};
