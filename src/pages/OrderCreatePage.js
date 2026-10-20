// Chức năng: Create đơn đặt mua; dịch vụ local kiểm tra dữ liệu, quyền và liên kết xe.
import RequestCreate from '../components/RequestCreate';
export default function OrderCreatePage(){return <RequestCreate resource="orders" title="Tạo đơn đặt mua" extra={null}/>;}
