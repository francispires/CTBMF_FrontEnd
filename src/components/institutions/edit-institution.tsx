import { Button } from "@nextui-org/react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export default function EditInstitution() {
  const { id } = useParams();
  const navigation = useNavigate()

  const handleBackToDisciplines = () => {
    navigation('/institutions')
  }

  return (
    <div className="p-6 overflow-auto min-h-[calc(100vh-65px)]">
      <Button variant="ghost" className="mb-6" onClick={handleBackToDisciplines}><FaArrowLeft /> Voltar</Button>
      <h1>Edit Institution: {id}</h1>
    </div>
  )
}
