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
import {EnrollmentResponseDto, IEnrollmentRequestDto} from "../../types_custom.ts";

const editDisciplineSchema = yup.object().shape({
  name: yup.string().required("Nome obrigatório."),
  description: yup.string().required("Descrição obrigatória.")
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
  } = useForm<IEnrollmentRequestDto>({
    resolver: yupResolver(editDisciplineSchema)
  });

  const mutation = useMutation({
    mutationFn: async (enroll: IEnrollmentRequestDto) => {
      const url = `${apiUrl}/disciplines/${id}`
      const res = await patch<IEnrollmentRequestDto>(url, enroll);

      if (!res) {
        throw new Error("Erro ao editar a matrícula.")
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['qryEnrollments'] });
      toast.success("Matrícula editada com sucesso.")
    },
    onError: () => {
      toast.error("Erro ao editar a Matrícula.")
    }
  })

  const fetchData = async () => {
    const url = `${apiUrl}/enrollments/${id}`
    return await get<EnrollmentResponseDto>(url)
  }

  const { isLoading, isError, data: enrollment } = useQuery({
    queryKey: ['enrollments'],
    queryFn: fetchData,
  })

  if (isLoading) {
    return (
      <PageLoader />
    )
  }

  if (isError || !enrollment) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-red-400">Ocorreu um erro ao buscar dados da matrícula.</span>
      </div>
    )
  }

  const handleBackToEnrollments = () => {
    navigation('/enrollments')
  }

  const onSubmit = async (data: IEnrollmentRequestDto) => {
    const updatedEnrollment: IEnrollmentRequestDto = {
      ...data
    }

    try {
      await mutation.mutateAsync(updatedEnrollment)
      handleBackToEnrollments()
    } catch (error) {
      console.error("Erro ao editar a disciplina:", error)
    }
  };

  return (
    <div>
      <Button variant="ghost" className="mb-6" onClick={handleBackToEnrollments}><FaArrowLeft /> Voltar</Button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 w-full max-w-xl mx-auto mb-16"
      >
        <h1 className="text-center my-6 text-lg font-semibold">Editar disciplina</h1>
        <Controller
            name="studentId"
            control={control}
            render={({ field }) => {
              return (
                  <Select2
                      {...field}
                      setValue={(s:string)=>{field.onChange(s)}}
                      valueProp={"id"}
                      textProp={"name"}
                      allowsCustomValue={false}
                      url={"users"}
                      useKey={true}
                      selectionMode="single"
                      className="max-w"
                      label="Aluno"
                      placeholder="Selecione um Aluno">
                  </Select2>
              );
            }}
        />
        {errors.studentId && <p>{errors.studentId.message}</p>}
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
        <Input {...register("startDate")} label="Início" pattern="YYYY-MM-DDTHH:mm:ss.sssZ" variant="bordered" type={"date"}/>
        {errors.startDate && <p>{errors.startDate.message}</p>}
        <Input {...register("endDate")} label="Fim" variant="bordered" type={"date"}/>
        {errors.endDate && <p>{errors.endDate.message}</p>}

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
