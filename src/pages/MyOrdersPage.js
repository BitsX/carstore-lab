// Chức năng: Read/Update/Delete đơn đặt mua của tài khoản đang đăng nhập.
// Chỉ yêu cầu mới/chờ được sửa/xóa; trạng thái đã xác nhận do nhân viên xử lý.
import RequestList from '../components/RequestList';
export default function MyOrdersPage(){return <RequestList resource="orders" title="Đơn đặt mua của tôi"/>;}
