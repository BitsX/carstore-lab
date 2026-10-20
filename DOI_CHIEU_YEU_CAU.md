# Đối chiếu yêu cầu Project cuối môn

Đối chiếu nội dung text của tài liệu người dùng cung cấp. Phần phân công được thay bằng cấu trúc pages/components thông thường, không chia theo thành viên.

| Nội dung yêu cầu | Chức năng trong project | Vị trí chính |
|---|---|---|
| Xem/tìm/lọc xe theo hãng/giá/loại | Có, thêm sắp xếp và phân trang | CarListPage, CarFilter |
| Xem chi tiết/thông số xe | Có hình, mã, giá, năm, loại, nhiên liệu, hộp số, chỗ, mô tả | CarDetailPage |
| So sánh xe | Có, tối đa 3 xe, bảng nhiều tiêu chí | ComparePage, CompareContext |
| CRUD xe, thông tin, ảnh, tồn, trạng thái | Có; kiểm tra mã/giá/tồn/danh mục; ngừng bán khi có nghiệp vụ | CarManagementPage, service cars |
| CRUD hãng và loại | Có tên/mô tả/logo/trạng thái; danh sách xe theo danh mục qua bộ lọc | BrandManagementPage, VehicleTypeManagementPage |
| Đăng ký/đăng nhập/hồ sơ/đổi mật khẩu | Có, PBKDF2-SHA256 với salt | Login/Register/Profile, passwordService |
| Quản trị khách hàng/khóa/mở khóa/phân quyền | Có; chặn xóa tài khoản có nghiệp vụ, cho admin vô hiệu hóa | CustomerManagementPage, service users |
| CRUD yêu cầu tư vấn | Có; tư vấn chung hoặc theo xe; ghi chú và trạng thái | ConsultationForm, MyConsultationsPage, ConsultationManagementPage |
| CRUD lịch lái thử | Có; tương lai, giờ làm việc, chặn trùng, đổi lịch khi chờ, hủy khi xác nhận | TestDriveBookingPage, MyTestDrivesPage, TestDriveManagementPage |
| CRUD đơn đặt mua/chi tiết/trạng thái | Có, chốt giá, giữ/hoàn tồn, không sửa/xóa hoàn tất | OrderCreatePage, MyOrdersPage, OrderManagementPage |
| ReactJS, component, Router, Hooks | Có | src/ |
| API và CSDL | Mô phỏng localStorage theo chỉ dẫn chỉ frontend FER; chưa có API/CSDL thật | carStoreService |
| Ảnh do người dùng gửi | Đóng gói đủ 30 JPG và logo, đường dẫn local | public/images |

## Giả định bổ sung

Một đơn đặt một xe. Mỗi mẫu xe có một xe demo lái thử, lượt dài 1 giờ ở đầu giờ 08:00–16:00 Việt Nam. Xóa xe có tư vấn/lịch hẹn cũng bị chặn để giữ lịch sử, dù tài liệu chỉ nêu rõ chặn xe có đơn. Giá và thông số mẫu phục vụ demo, không được xác minh chính hãng. Không triển khai thanh toán thật.
