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
import {ConfigRequestDto, ConfigResponseDto} from "../../types_custom.ts";

const editSchema = yup.object().shape({
  key: yup.string().required("Nome obrigatório."),
  value: yup.string().required("Valor obrigatória."),
});

type EditSchema = yup.InferType<typeof editSchema>;

export default function EditConfig() {
  const { id } = useParams();
  const navigation = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<EditSchema>({
    resolver: yupResolver(editSchema)
  });

  const mutation = useMutation({
    mutationFn: async (updateConfig: ConfigRequestDto) => {
      const url = `${apiUrl}/configs/${id}`
      const res = await patch<ConfigRequestDto>(url, updateConfig);

      if (!res) {
        throw new Error("Erro ao editar a configuração.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qryConfig'] });
      toast.success("Configuração editada com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar a configuração.")
    }
  })

  const fetchData = async () => {
    const url = `${apiUrl}/configs/${id}`
    return await get<ConfigResponseDto>(url)
  }

  const { isLoading, isError, data: config } = useQuery({
    queryKey: ['qryConfig', id],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !config) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da configuração.</span>
      </div>
    )
  }

  const backTConfigs = () => {
    navigation('/settings')
  }

  const onSubmit = async (data: EditSchema) => {
    const updatedConfig: ConfigRequestDto = {
      ...config,
      key: data.key ? data.key : config.key,
      value: data.value ? data.value : config.value
    }

    try {
      await mutation.mutateAsync(updatedConfig)
      backTConfigs()
    } catch (error) {
      console.error("Erro ao editar a configrução:", error)
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={backTConfigs}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <h1 className="text-center my-6 text-lg font-semibold">Editar disciplina</h1>

        <Input {...register("key")} label="Nome" variant="bordered" defaultValue={config.key} />
        {errors.key && <cite className={"text-danger"}>{errors.key.message}</cite>}

        <Input {...register("value")} label="Descrição" variant="bordered" defaultValue={config.value} />
        {errors.value && <cite className={"text-danger"}>{errors.value.message}</cite>}
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
