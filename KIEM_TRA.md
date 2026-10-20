# Kết quả kiểm tra

- `npm run build`: biên dịch production thành công.
- `CI=true npm test -- --watchAll=false --runInBand`: 2 test suite, 18 bài kiểm thử đạt.
- 30 JPG và 1 PNG logo khớp nguyên bản Images.zip; toàn bộ đường dẫn ảnh của 30 xe tồn tại.
- Test giao diện bằng React Testing Library: trang chủ, lọc loại xe, thêm hai xe và đọc bảng so sánh.
- Test nghiệp vụ: CRUD, quyền/ownership mô phỏng, mật khẩu băm/đổi mật khẩu, danh mục, tư vấn, lịch hẹn, tồn kho, giá chốt và hồ sơ kết thúc.
- Chưa kiểm tra E2E hoặc bố cục bằng trình duyệt thực trong môi trường này; cần chạy npm start trên máy bạn để kiểm tra hiển thị thực tế.

Node dùng cho kiểm tra: v24.19.0. Project khuyến nghị Node 22; giữ package-lock.json và chạy npm ci. ZIP không chứa node_modules hoặc build để gọn và tránh phụ thuộc máy đã cài.
