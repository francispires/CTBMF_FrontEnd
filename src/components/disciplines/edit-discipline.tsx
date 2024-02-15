import { Button, Input, Spinner } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import Select2 from "../select2";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup/src/yup.js";
import * as yup from 'yup';
import { get, patch } from "../../_helpers/api";
import { toast } from "react-toastify";
import { PageLoader } from "../page-loader";
import { useState } from "react";

const editDisciplineSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório."),
  description: yup.string().required("Descrição obrigatória."),
  parentId: yup.string().nullable(),
});

type EditDisciplineSchema = yup.InferType<typeof editDisciplineSchema>;

export default function EditDiscipline() {
  const { id } = useParams();
  const navigation = useNavigate()
  const queryClient = useQueryClient()

  const [parentId, setParentId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<EditDisciplineSchema>({
    resolver: yupResolver(editDisciplineSchema)
  });

  const mutation = useMutation({
    mutationFn: async (updatedDiscipline: Discipline) => {
      const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
      const url = `${apiUrl}/disciplines/${id}`
      const res = await patch<Discipline>(url, updatedDiscipline);

      if (!res) {
        throw new Error("Erro ao editar a disciplina.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qryKey'] });
      toast.success("Disciplina editada com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar a disciplina.")
    }
  })

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_REACT_APP_API_SERVER_URL
    const url = `${apiUrl}/disciplines/${id}`
    const res = await get<Discipline>(url)

    return res
  }

  const { isLoading, isError, data: discipline } = useQuery({
    queryKey: ['discipline'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !discipline) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da disciplina.</span>
      </div>
    )
  }

  const handleBackToDisciplines = () => {
    navigation('/disciplines')
  }

  const onSubmit = async (data: EditDisciplineSchema) => {
    const updatedDiscipline: Discipline = {
      ...discipline,
      name: data.name ? data.name : discipline.name,
      description: data.description ? data.description : discipline.description,
      parentId: parentId ? parentId : discipline.parentId
    }

    try {
      await mutation.mutateAsync(updatedDiscipline)
      handleBackToDisciplines()
    } catch (error) {
      console.error("Erro ao editar a disciplina:", error)
    }
  };

  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <Button variant="ghost" className="mb-6" onClick={handleBackToDisciplines}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <h1 className="text-center my-6 text-lg font-semibold">Editar disciplina</h1>

        <Input {...register("name")} label="Nome" variant="bordered" defaultValue={discipline.name} />
        {errors.name && <cite className={"text-danger"}>{errors.name.message}</cite>}

        <Input {...register("description")} label="Descrição" variant="bordered" defaultValue={discipline.description} />
        {errors.description && <cite className={"text-danger"}>{errors.description.message}</cite>}

        <Controller
          name="parentId"
          control={control}
          render={({ field }) => {
            return (
              <Select2
                {...field}
                setValue={setParentId}
                valueProp={"id"}
                textProp={"id"}
                url={"disciplines"}
                selectionMode="single"
                className="max-w-xs"
                label="Disciplina Mãe"
                placeholder="Selecione uma disciplina"
              >
              </Select2>
            );
          }}
        />

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
