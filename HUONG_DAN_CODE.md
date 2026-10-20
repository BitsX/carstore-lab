# Hướng dẫn đọc code CarStore Lab

## Đọc theo thứ tự

1. **index.js:** ReactDOM tạo root; BrowserRouter theo dõi URL; AuthProvider và CompareProvider cung cấp dữ liệu dùng chung.
2. **App.js:** mỗi Route gắn URL với page. Trang cần đăng nhập được bọc Guard. Trang quản lý kiểm tra role.
3. **HomePage.js, CarListPage.js:** useEffect nạp xe; useState giữ filter, page, error. filter chọn xe thỏa điều kiện, sort sắp thứ tự, slice chia trang.
4. **CarFilter.js:** không tự sửa danh sách xe; nhận value và onChange qua props, gửi filter mới lên CarListPage.
5. **CarDetailPage.js:** useParams lấy id từ URL /cars/:id, service đọc xe và render chi tiết.
6. **CompareContext.js:** mảng id dùng chung cho thẻ xe và trang so sánh. Giới hạn 3 xe; sessionStorage giữ lựa chọn khi chuyển trang/refresh.
7. **LoginPage.js → AuthContext.js → carStoreService.js:** gửi thông tin vào service local, kiểm tra passwordHash, lưu id user trong sessionStorage, cập nhật state để menu render lại.
8. **CarManagementPage.js → CrudPage.js:** page định nghĩa fields/columns/defaults; component chung dựng form/table. Submit gọi service ghi và tải lại bảng.
9. **RequestCreate.js / RequestList.js:** dùng chung cho tư vấn, lịch, đơn. Các page riêng truyền resource/title/extra/ manage để chọn nghiệp vụ.
10. **carStoreService.js:** loadStore đọc JSON từ localStorage; current tìm user đang hoạt động; prepare kiểm tra/chuẩn hóa trước khi ghi; remove kiểm tra điều kiện xóa; storeRequest điều phối thao tác.

## Các tham số trong service

Để code ngắn, service dùng `db` cho object dữ liệu toàn bộ, `t` cho tên collection (cars, orders...), `d` cho dữ liệu biểu mẫu, `u` cho user đang đăng nhập và `old` cho hồ sơ đang sửa.

Ví dụ đọc danh sách: `await storeRequest('cars')`.

Ví dụ thêm: `await storeRequest('brands', 'POST', {name:'Hãng mới', active:1, description:'...', logo:''})`.

Ví dụ sửa: `await storeRequest('brands/2', 'PUT', {...brand, name:'Tên sửa'})`.

Ví dụ xóa: `await storeRequest('brands/2', 'DELETE')`.

Không có fetch/axios ở đây vì người dùng yêu cầu không làm backend. Các phương thức là quy ước trong hàm local.

## Các URL quan trọng

| URL | Trang |
|---|---|
| / | Trang chủ |
| /cars | Tìm/lọc danh sách xe |
| /cars/:id | Chi tiết xe |
| /compare | So sánh tối đa 3 xe |
| /login, /register, /profile | Tài khoản |
| /consultations/new, /my/consultations | Tạo/theo dõi tư vấn |
| /testdrives/new, /my/testdrives | Đặt/theo dõi lịch lái thử |
| /orders/new, /my/orders | Đặt/theo dõi đơn mua |
| /admin | Tổng quan nhân viên/quản trị |
| /admin/cars, /admin/brands, /admin/types | CRUD xe/danh mục |
| /admin/users | Quản trị tài khoản |
| /admin/consultations, /admin/testdrives, /admin/orders | Xử lý nghiệp vụ |

## Chỗ sửa giao diện/dữ liệu

- Sửa menu: components/AppNavbar.js.
- Sửa banner/trang chủ: pages/HomePage.js.
- Sửa CSS: App.css, index.css.
- Sửa tên/trường hiển thị quản lý: fields và columns trong page quản lý.
- Sửa dữ liệu khởi tạo: data/seed.js; lưu ý reset localStorage khi cần nạp seed mới.
- Sửa quy tắc nghiệp vụ: services/carStoreService.js, không chỉ sửa điều kiện ẩn nút trên giao diện.

## Các kiến thức FER được áp dụng

Function component; props; JSX; render có điều kiện; map/filter/sort/slice; controlled form; useState; useEffect; useCallback; Context API; React Router; useNavigate/useParams/useSearchParams; async/await và try/catch; localStorage/sessionStorage; tái sử dụng component; validation và responsive CSS.
