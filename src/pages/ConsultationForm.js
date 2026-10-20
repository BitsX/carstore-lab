// Chức năng: Create yêu cầu tư vấn; dịch vụ local kiểm tra dữ liệu, quyền và liên kết xe.
import RequestCreate from '../components/RequestCreate';
export default function ConsultationForm(){return <RequestCreate resource="consultations" title="Tạo yêu cầu tư vấn" extra={"content"}/>;}
