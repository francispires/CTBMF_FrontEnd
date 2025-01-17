import {Button, Input, Spinner} from "@nextui-org/react";
import {Controller, useForm} from "react-hook-form";
import {FaArrowLeft} from "react-icons/fa";
import Select2 from "../../components/select2";
import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {yupResolver} from "@hookform/resolvers/yup/src/yup.js";
import * as yup from 'yup';
import {get, patch} from "../../_helpers/api.ts";
import {toast} from "react-toastify";
import {PageLoader} from "../../components/page-loader.tsx";
import {apiUrl} from "../../_helpers/utils.ts";
import {IUserRequestDto, UserResponseDto} from "../../types_custom.ts";

const editUserSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório.")
});

export default function EditUser() {
  const { id } = useParams();
  const navigation = useNavigate()
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<IUserRequestDto>({
    resolver: yupResolver(editUserSchema)
  });

  const mutation = useMutation({
    mutationFn: async (user: IUserRequestDto) => {
      const url = `${apiUrl}/users/${id}`
      user.id = id;
      const res = await patch<IUserRequestDto>(url, user);

      if (!res) {
        throw new Error("Erro ao editar o usuário.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qryEnrollments'] });
      toast.success("Usuário editado com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar o usuário.")
    }
  })

  const fetchData = async () => {
    const url = `${apiUrl}/users/${id}`
    return await get<UserResponseDto>(url)
  }

  const { isLoading, isError, data: user } = useQuery({
    queryKey: ['users'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da matrícula.</span>
      </div>
    )
  }

  const handleBackToUsers = () => {
    navigation('/users')
  }

  const onSubmit = async (data: IUserRequestDto) => {
    const updatedUser: IUserRequestDto = {
      ...data
    }

    try {
      await mutation.mutateAsync(updatedUser)
      handleBackToUsers()
    } catch (error) {
      console.error("Erro ao editar o usuário:", error)
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToUsers}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <h1 className="text-center my-6 text-lg font-semibold">Editar usuário</h1>
        <Controller
            name="crewId"
            control={control}
            render={({ field }) => {
              return (
                  <Select2
                      {...field}
                      setValue={(s:string)=>{field.onChange(s)}}
                      valueProp={"id"}
                      textProp={"name"}
                      useKey={true}
                      allowsCustomValue={false}
                      url={"crews"}
                      selectionMode="single"
                      className="max-w"
                      label="Turma"
                      placeholder="Selecione uma Turma">
                  </Select2>
              );
            }}
        />
        {errors.crewId && <p>{errors.crewId.message}</p>}
        <Input {...register("name")} value={user.name} label="Nome" variant="bordered"/>
        {errors.name && <p>{errors.name.message}</p>}
        <Input {...register("email")}  value={user.email} label="Email" variant="bordered"/>
        {errors.email && <p>{errors.email.message}</p>}
        <Input {...register("address")} value={user.address} label="Endereço" variant="bordered"/>
        {errors.address && <p>{errors.address.message}</p>}
        <Input {...register("birthDay")}  value={user.birthDay?.toString()} label="Nascimento" variant="bordered" type={"date"}/>
        {errors.birthDay && <p>{errors.birthDay.message}</p>}
        <Input {...register("phoneNumber")} value={user.phoneNumber} label="Telefone" variant="bordered"/>
        <Input {...register("role")} value={user.role} type="hidden" className={"hidden"}/>
        <Input {...register("sid")} value={user.sid} type="hidden" className={"hidden"}/>
        {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        <Button
          type={"submit"}
          color="primary"
          className="my-6 mx-auto max-w-[150px] w-full"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <Spinner size="sm" color="white" />
          ) : (
            <span>Salvar</span>
          )}
        </Button>
      </form>
    </div>
  )
}
