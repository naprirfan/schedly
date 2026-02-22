import { PatientDetail } from "./PatientDetail";

export default async function PatientDetailPage({params}: {params: any;}) {
    const {id} = await params;
    return <PatientDetail id={id} />
}