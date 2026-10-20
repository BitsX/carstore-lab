# CarStore Lab

Project cuối môn FER được viết theo sườn bài lab React trên VS Code: `public/index.html`, `src/App.js`, `src/index.js`, `App.css`, `index.css`, thư mục `pages`, `components`, `context`, `data`, `services`. Không chia thư mục hay code theo tên thành viên.

Có đủ 6 module trong **Project cuối môn.docx**, bổ sung so sánh xe, trang chủ và trang tổng quan quản lý. Dùng đúng 30 ảnh Porsche và logo từ **Images.zip** được cung cấp. Ảnh có sẵn trong project, không tải ảnh ngoài khi chạy.

## 1. Cách mở và chạy trên VS Code

Yêu cầu: Node.js 22 và npm. Mở đúng thư mục `carstore-lab` có `package.json` bằng File → Open Folder.

Terminal → New Terminal:

```powershell
npm ci
npm start
```

Mở `http://localhost:3000` hoặc cổng terminal thông báo. Giữ terminal đang chạy; Ctrl+C để dừng. Không mở `public/index.html` bằng double click, không chạy ở thư mục cha chứa file ZIP. Không cần Python, SQL Server hay terminal backend.

Lần đầu cài thư viện cần mạng. Sau khi đã cài node_modules, có thể chạy project với ảnh và dữ liệu local. Các cảnh báo thư viện cũ của react-scripts không có nghĩa project bị lỗi. Giữ package-lock.json để dùng đúng phiên bản. Không cần cài thêm ESLint hoặc các thư viện khác để chạy bản này.

Nếu cổng 3000 đã được dùng, chọn Y khi terminal hỏi chuyển cổng. Mỗi cổng/origin có dữ liệu localStorage riêng. Đừng chạy từ hai cổng khác nhau rồi mong thấy cùng một bộ dữ liệu.

## 2. Tài khoản dùng thử

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Quản trị viên | admin@carstore.local | Admin123! |
| Nhân viên | staff@carstore.local | Staff123! |
| Khách hàng | customer@carstore.local | Customer123! |

Có thể đăng ký tài khoản khách mới. Admin được đổi quyền, khóa/mở khóa tài khoản tại trang Quản lý → Tài khoản. Khách hàng chỉ xem/sửa hồ sơ và các yêu cầu của mình; nhân viên xem toàn bộ nghiệp vụ; danh sách tài khoản chỉ admin xem.

## 3. Phạm vi frontend FER

Theo yêu cầu trong cuộc trao đổi, bản này **chỉ làm frontend, không có backend**. Dòng “API với CSDL” trong tài liệu được mô phỏng bằng một service JavaScript và localStorage. `storeRequest(...)` không gọi HTTP; các từ POST/GET/PUT/DELETE trong tham số chỉ là cách phân loại CRUD trong code. Nếu giảng viên bắt buộc API/CSDL thật thì cần thay service này bằng API; bản hiện tại chưa đáp ứng phần hạ tầng đó.

Mật khẩu demo được băm PBKDF2-SHA256, 100.000 vòng, salt riêng, không lưu dạng rõ trong dữ liệu user. Tuy nhiên dữ liệu và phân quyền vẫn nằm trên trình duyệt, có thể bị thay đổi bằng DevTools; đây là mô phỏng bài học, không phải hệ thống đăng nhập an toàn thực tế. Không nhập dữ liệu/mật khẩu thật. Ảnh, giá, nhiên liệu, hộp số và số chỗ trong dữ liệu ban đầu phục vụ demo, không phải thông tin/báo giá đã xác minh chính hãng.

Dữ liệu mỗi máy, mỗi trình duyệt độc lập; không đồng bộ giữa người dùng/máy, không đảm bảo xử lý đồng thời giữa nhiều tab. Khi thay đổi quyền trong tab khác, tải lại giao diện để cập nhật menu; các lần gọi service kiểm tra user đang hoạt động từ dữ liệu hiện tại.

## 4. Cấu trúc dễ đọc như bài lab

| File/thư mục | Vai trò |
|---|---|
| public/index.html | Trang HTML gốc, React render vào root |
| public/images/ | 30 ảnh Porsche và carstore-logo.png từ ZIP |
| src/index.js | Khởi tạo Router, AuthProvider, CompareProvider |
| src/App.js | Khai báo URL và component tương ứng |
| src/App.css, src/index.css | CSS toàn bộ website và responsive |
| src/pages/ | Tất cả các trang, không có tên/thư mục thành viên |
| src/components/AppNavbar.js, Footer.js | Header, menu, footer dùng chung |
| src/components/CarCard.js, CarFilter.js | Thẻ xe và bộ lọc |
| src/components/CrudPage.js | Bảng, form tạo/sửa, tìm trong bảng, xóa, popup chi tiết |
| src/components/RequestCreate.js, RequestList.js | Form và danh sách dùng chung cho 3 loại yêu cầu |
| src/components/Guard.js | Chuyển sang đăng nhập, chặn trang sai quyền mô phỏng |
| src/context/AuthContext.js | Trạng thái đăng nhập; login/logout |
| src/context/CompareContext.js | Giữ tối đa 3 xe cần so sánh |
| src/data/seed.js | Dữ liệu khởi tạo 30 xe, 1 hãng, 4 loại, 3 tài khoản |
| src/services/carStoreService.js | CRUD, quy tắc nghiệp vụ, lưu localStorage |
| src/services/passwordService.js | Băm và kiểm tra mật khẩu |
| HUONG_DAN_CODE.md | Hướng dẫn đọc code, các URL, cách thay ảnh/dữ liệu |
| DOI_CHIEU_YEU_CAU.md | Ma trận chức năng so với tài liệu yêu cầu |

## 5. Các chức năng đã có

### Khách hàng

- Trang chủ có ảnh banner và xe nổi bật.
- Danh sách 30 mẫu xe, phân trang, tìm tên/mã, lọc hãng/loại/khoảng giá, sắp xếp giá/tên/năm.
- Chi tiết hình ảnh, giá và thông số xe.
- Chọn tối đa 3 xe để so sánh ảnh, giá, kiểu dáng, năm, nhiên liệu, hộp số, số chỗ, tồn và hỗ trợ lái thử.
- Đăng ký, đăng nhập/đăng xuất, sửa hồ sơ, đổi mật khẩu, xóa tài khoản chưa có nghiệp vụ.
- Gửi tư vấn theo xe hoặc tư vấn chung; đọc, sửa, hủy/xóa khi còn mới.
- Đặt lịch lái thử, xem lịch của mình, đổi/xóa khi chờ; hủy lịch đã được xác nhận bằng nút Hủy lịch.
- Gửi yêu cầu đặt mua, xem danh sách/chi tiết đơn, sửa liên hệ/hủy/xóa khi chờ.

### Nhân viên và quản trị viên

- Trang tổng quan số xe đang bán và các yêu cầu chờ xử lý.
- CRUD xe: tên/mã, giá, ảnh, hãng/loại, thông số, tồn, trạng thái và hỗ trợ lái thử.
- CRUD hãng/loại: tên, mô tả, logo/ảnh và trạng thái.
- Xem/tiếp nhận tư vấn, ghi chú, cập nhật hoàn tất hoặc hủy.
- Xác nhận, hoàn tất hoặc hủy lịch lái thử; kiểm tra trùng khung giờ.
- Xem chi tiết, xác nhận/hoàn tất/hủy đơn; giữ/hoàn tồn kho.
- Admin quản lý tài khoản, sửa hồ sơ khách, đổi quyền và khóa/mở khóa. Create tài khoản qua trang đăng ký.

## 6. Quy tắc nghiệp vụ chính

- Mã xe, email, tên hãng và tên loại xe không trùng (không phân biệt hoa thường).
- Giá dương, tồn kho nguyên không âm. Không gán danh mục ngừng hoạt động cho xe mới. Chỉ xe đang kinh doanh hiện để khách đặt mua.
- Xe có đơn/tư vấn/lịch hẹn không xóa trực tiếp để giữ liên kết; dùng trạng thái ngừng kinh doanh. Danh mục đang có xe không xóa.
- Email đúng định dạng, mật khẩu ít nhất 8 ký tự. Khách không tự nâng quyền; admin không tự khóa hoặc hạ quyền chính mình. Tài khoản đã có nghiệp vụ không xóa; admin vô hiệu hóa.
- Điện thoại bắt buộc 10 chữ số. Tư vấn chung không bắt buộc xe, nếu chọn xe thì xe phải tồn tại.
- Tư vấn: mới → đang xử lý → hoàn thành, có nhánh hủy. Khách chỉ sửa/xóa yêu cầu mới; nhân viên ghi kết quả.
- Lái thử: chờ → xác nhận → hoàn thành, có nhánh hủy. Thời gian tương lai, đầu giờ từ 08:00 đến 16:00 Việt Nam, mỗi lượt 1 giờ. Mỗi mẫu coi là có một xe demo; chỉ một lịch xác nhận cho mỗi mẫu/giờ. Lưu UTC, danh sách hiển thị giờ Việt Nam. Nên đặt máy tính theo giờ Việt Nam để nhập lịch. Lịch đã xác nhận, khách chỉ hủy, không sửa ngày giờ hoặc liên hệ.
- Đơn: chờ → xác nhận → hoàn tất, có nhánh hủy. Giá lưu lúc tạo, thay giá xe không sửa giá đơn. Xác nhận giữ 1 xe (tồn khả dụng giảm 1); hủy đơn xác nhận hoàn lại 1. Hoàn tất không giảm thêm. Không tự sửa/xóa hồ sơ đã kết thúc.
- Giá trị đơn đã hoàn tất ở tổng quan là tổng giá yêu cầu được đánh dấu hoàn tất, không phải tiền đã thu. Không có thanh toán trực tuyến.

## 7. Kịch bản kiểm tra/demo

1. Chạy project → trang chủ → Bộ sưu tập. Chọn lọc SUV và khoảng giá; xóa lọc để thấy lại 30 xe.
2. Chọn 2–3 xe → So sánh → bỏ một xe; thử chọn xe thứ tư để thấy thông báo giới hạn.
3. Đăng ký tài khoản mới → đăng nhập → sửa hồ sơ/đổi mật khẩu.
4. Chọn một xe → tư vấn → nhập nội dung và điện thoại → xem ở Tư vấn của tôi. Đăng nhập staff → tiếp nhận/ghi chú/hoàn tất.
5. Khách tạo 2 lịch cùng xe/giờ → staff xác nhận lịch thứ nhất → lịch thứ hai bị chặn. Khách có thể hủy lịch đã xác nhận.
6. Khách đặt mua xe → admin xác nhận → xem tồn giảm. Admin hủy đơn → tồn hoàn lại. Tạo đơn khác rồi hoàn tất để thấy giá trị ở tổng quan.
7. Admin thêm hãng/loại, thêm xe, sửa, xóa xe mới. Thử xóa hãng đang có xe để thấy chặn.
8. Admin khóa user → user không thể đăng nhập/tạo yêu cầu. Refresh trang để cập nhật phiên/menu.

## 8. Lưu dữ liệu và thay ảnh

Dữ liệu lưu ở localStorage khóa `carstore_lab_v2`, phiên ở sessionStorage `carstore_lab_user`, xe so sánh ở `carstore_lab_compare`. Refresh giữ dữ liệu; không chia sẻ giữa máy khác. Muốn đặt lại hoàn toàn về 30 xe và tài khoản mẫu: mở DevTools → Application → Local Storage, xóa riêng khóa `carstore_lab_v2`, rồi đăng xuất/tải lại. Thao tác reset làm mất mọi dữ liệu thử đã tạo.

Thay ảnh xe trong Quản lý → Xe → Sửa → Đường dẫn ảnh. Dùng tên chính xác, ví dụ `/images/01_2025-porsche-911-carrera-gts.jpg`. Nếu thêm ảnh mới, chép vào `public/images`, rồi điền `/images/ten-anh.jpg`. Không nhập `public/` ở đầu đường dẫn. Mẫu xe ban đầu theo tên file ảnh; muốn đổi thông số, chỉnh ở màn hình quản lý.

Sửa seed.js chỉ ảnh hưởng dữ liệu khởi tạo khi chưa có localStorage. Nếu đã chạy trước đó, sửa seed rồi refresh không ghi đè dữ liệu đang dùng; cần reset theo hướng dẫn nếu muốn nạp lại seed.

## 9. Kiểm tra kỹ thuật

```powershell
npm run build
npm test -- --watchAll=false
```

Các bài test React/service kiểm tra tìm/lọc/so sánh, CRUD, quyền mô phỏng, băm/đổi mật khẩu, tư vấn chung, giữ/hoàn tồn và lịch trùng. Không cần thêm thư viện để chạy test. node_modules không đóng gói trong ZIP, được tạo bởi npm ci.

Các dependency theo sườn Create React App được khóa phiên bản; TypeScript 4.9.5 chỉ là dependency công cụ tương thích react-scripts, source ứng dụng vẫn là JavaScript .js. Dùng đúng lệnh ở trên thay vì tự nâng tất cả dependency của project.
