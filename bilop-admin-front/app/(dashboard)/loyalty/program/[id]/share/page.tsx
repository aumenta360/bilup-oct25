import { ShareProgram } from "../../../../../../components/loyalty/program/share"
import { loyaltyService } from "../../../../../../services/loyalty-service"
import { notFound } from "next/navigation"

const SharePage = async ({ params }: { params: { id: string } }) => {
  const program = await loyaltyService.getProgramById(Number(params.id))

  if (!program) {
    notFound()
  }

  return <ShareProgram program={program as any} />
}

export default SharePage;
