// Chức năng: nhân viên đọc toàn bộ, cập nhật trạng thái và xóa yêu cầu còn mới.
// Xác nhận giữ một xe; hủy đơn đã xác nhận hoàn kho, trong một lần ghi localStorage.
import RequestList from '../components/RequestList';
export default function OrderManagementPage(){return <RequestList resource="orders" title="Quản lý đơn đặt mua" manage/>;}
