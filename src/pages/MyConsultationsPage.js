// Chức năng: Read/Update/Delete yêu cầu tư vấn của tài khoản đang đăng nhập.
// Chỉ yêu cầu mới/chờ được sửa/xóa; trạng thái đã xác nhận do nhân viên xử lý.
import RequestList from '../components/RequestList';
export default function MyConsultationsPage(){return <RequestList resource="consultations" title="Yêu cầu tư vấn của tôi"/>;}
