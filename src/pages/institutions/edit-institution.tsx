import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import { Button, Checkbox, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { STATES } from "../../utils/placeholders.ts";
import * as yup from 'yup';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { get, patch } from "../../_helpers/api.ts";
import { toast } from "react-toastify";
import { PageLoader } from "../../components/page-loader.tsx";
import { Question, QuestionBank } from "../../types_custom.ts";
import { useState } from "react";

export interface Institution {
  id: string,
  name: string,
  state: string,
  stadual: boolean,
  privateInstitution: boolean,
  questions: Question[] | null
  questionBanks: QuestionBank[] | null
  createdAt: string
}

const createSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
  state: yup.string().required("Estado é obrigatório"),
  privateInstitution: yup.boolean().required("Tipo de Instituição é obrigatório"),
  stadual: yup.boolean().required("Tipo de Instituição é obrigatório"),
});

type InstitutionSchema = yup.InferType<typeof createSchema>

export default function EditInstitution() {
  const { id } = useParams();
  const navigation = useNavigate()
  const queryClient = useQueryClient()

  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isStadual, setIsStadual] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<InstitutionSchema>({
    resolver: yupResolver(createSchema),
  });

  const mutation = useMutation({
    mutationFn: async (updatedInstitution: Institution) => {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
      const url = `${apiUrl}/institutions/${id}`
      const res = await patch<Institution>(url, updatedInstitution);

      if (!res) {
        throw new Error("Erro ao editar a instituição.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
      await queryClient.invalidateQueries({ queryKey: ['institution'] });
      toast.success("Instituição editada com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar a instituição.")
    }
  })

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
    const url = `${apiUrl}/institutions/${id}`
    const res = await get<Institution>(url)

    setIsPrivate(res.privateInstitution)
    setIsStadual(res.stadual)

    return res
  }

  const { isLoading, isError, data: institution } = useQuery({
    queryKey: ['institution'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !institution) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da instituição.</span>
      </div>
    )
  }

  const handleSetPrivate = (checked: boolean) => {
    setIsPrivate(checked);
    setIsStadual(!checked);
  }
  const handleSetStadual = (checked: boolean) => {
    setIsStadual(checked);
    setIsPrivate(!checked);
  }

  const handleBackToInstitutions = () => {
    navigation('/institutions')
  }

  const onSubmit = async (data: InstitutionSchema) => {
    const updatedInstitution: Institution = {
      ...institution,
      name: data.name ? data.name : institution.name,
      state: data.state ? data.state : institution.state,
      stadual: isStadual,
      privateInstitution: isPrivate,
    }

    try {
      await mutation.mutateAsync(updatedInstitution)
      handleBackToInstitutions()
    } catch (error) {
      console.error("Erro ao editar a instituição:", error)
    }
  };

  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <Button variant="ghost" className="mb-6" onClick={handleBackToInstitutions}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <h1 className="text-center my-6 text-lg font-semibold">Editar instituição</h1>


        <Input {...register("name")} label="Nome" variant="bordered" defaultValue={institution.name} />
        {errors.name &&
          <cite className={"text-danger"}>{errors.name.message}</cite>}
        <div className="flex gap-3 items-center">
          <Controller
            name="state"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  selectionMode="single"
                  className="w-1/3"
                  label="Estado"
                  placeholder="Selecione um Estado">
                  {STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </Select>
              );
            }}
          />

          <div>
            <span className="block text-sm">Estado atual:</span>
            <span className="block text-sm">{institution.state}</span>
          </div>
        </div>

        {errors.state &&
          <cite className={"text-danger"}>{errors.state.message}</cite>}
        <Checkbox isSelected={isPrivate} onValueChange={handleSetPrivate}>
          Privada
        </Checkbox>
        <input {...register("privateInstitution")} type={"hidden"} value={isPrivate.toString()} />

        {errors.privateInstitution &&
          <cite className={"text-danger"}>{errors.privateInstitution.message}</cite>}
        <Checkbox isSelected={isStadual} onValueChange={handleSetStadual}>
          Estadual
        </Checkbox>
        <input {...register("stadual")} type={"hidden"} value={isStadual.toString()} />
        {errors.stadual &&
          <cite className={"accent-danger"}>{errors.stadual.message}</cite>}

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
