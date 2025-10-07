import EditProgram from "../../../../../../components/loyalty/program/edit"
import { CreateProgramProvider } from "../../../../../../context/create-program-context"

const EditPage = ({ params }: { params: { id: string } }) => {
  return (
    <CreateProgramProvider>
      <EditProgram params={{ id: params.id }} />
    </CreateProgramProvider>
  )
}

export default EditPage;
