import { Button, Input, Spinner } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import * as yup from 'yup';
import { get, patch } from "../../_helpers/api.ts";
import { toast } from "react-toastify";
import { PageLoader } from "../../components/page-loader.tsx";
import {apiUrl} from "../../_helpers/utils.ts";
import {ICrewRequestDto} from "../../types_custom.ts";

const editCrewSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório."),
  description: yup.string().required("Descrição obrigatória.")
});

type EditCrewSchema = yup.InferType<typeof editCrewSchema>;

export default function EditCrew() {
  const { id } = useParams();
  const navigation = useNavigate()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditCrewSchema>({
    resolver: yupResolver(editCrewSchema)
  });

  const mutation = useMutation({
    mutationFn: async (updatedCrew: ICrewRequestDto) => {
      const url = `${apiUrl}/crews/${id}`
      const res = await patch<ICrewRequestDto>(url, updatedCrew);

      if (!res) {
        throw new Error("Erro ao editar a turma.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qrycrews'] });
      await queryClient.invalidateQueries({ queryKey: ['crews'] });
      toast.success("Turma editada com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar a Turma.")
    }
  })

  const fetchData = async () => {
    const url = `${apiUrl}/crews/${id}`
    const res = await get<Discipline>(url)

    return res
  }

  const { isLoading, isError, data: crew } = useQuery({
    queryKey: ['crews'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !crew) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da disciplina.</span>
      </div>
    )
  }

  const handleBackToCrews = () => {
    navigation('/crews')
  }

  const onSubmit = async (data: EditCrewSchema) => {
    const updatedCrew: ICrewRequestDto = {
      ...crew,
      name: data.name ? data.name : crew.name,
      description: data.description ? data.description : crew.description
    }

    try {
      await mutation.mutateAsync(updatedCrew)
      handleBackToCrews()
    } catch (error) {
      console.error("Erro ao editar a disciplina:", error)
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToCrews}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <h1 className="text-center my-6 text-lg font-semibold">Editar disciplina</h1>

        <Input {...register("name")} label="Nome" variant="bordered" defaultValue={crew.name} />
        {errors.name && <cite className={"text-danger"}>{errors.name.message}</cite>}

        <Input {...register("description")} label="Descrição" variant="bordered" defaultValue={crew.description} />
        {errors.description && <cite className={"text-danger"}>{errors.description.message}</cite>}
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
