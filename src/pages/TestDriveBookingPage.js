// Chức năng: Create lịch lái thử; dịch vụ local kiểm tra dữ liệu, quyền và liên kết xe.
import RequestCreate from '../components/RequestCreate';
export default function TestDriveBookingPage(){return <RequestCreate resource="testdrives" title="Tạo lịch lái thử" extra={"slot"}/>;}
