import {storeRequest as store,STORAGE_KEY,loadStore} from './carStoreService';
beforeEach(()=>{localStorage.clear();sessionStorage.clear();});
const login=(role='admin')=>store('login','POST',{email:role+'@carstore.local',password:role==='admin'?'Admin123!':role==='staff'?'Staff123!':'Customer123!'});
const contact={car_id:1,name:'Khách',phone:'0912345678'};
test('dữ liệu CRUD giữ sau khi đọc lại localStorage',async()=>{
 await login();let b=await store('brands','POST',{name:'Hãng test',active:1});b=await store('brands/'+b.id,'PUT',{...b,name:'Hãng sửa'});
 expect(loadStore().brands.find(x=>x.id===b.id).name).toBe('Hãng sửa');await store('brands/'+b.id,'DELETE');expect(loadStore().brands.find(x=>x.id===b.id)).toBeUndefined();expect(localStorage.getItem(STORAGE_KEY)).toBeTruthy();
});
test('khách không nâng quyền và chỉ xem đơn của mình',async()=>{
 await login('customer');const me=await store('me');expect((await store('users/'+me.id,'PUT',{...me,role:'admin'})).role).toBe('customer');await expect(store('cars','POST',{})).rejects.toThrow();
 const a=await store('orders','POST',contact);await store('register','POST',{name:'Khách khác',email:'other@test.local',password:'12345678',role:'admin'});
 await store('login','POST',{email:'other@test.local',password:'12345678'});expect((await store('me')).role).toBe('customer');expect(await store('orders')).toEqual([]);await expect(store('orders/'+a.id)).rejects.toThrow();
});
test('giá đơn chốt, xác nhận giữ tồn, hủy hoàn tồn đúng một lần',async()=>{
 await login('customer');const a=await store('orders','POST',{...contact,price:1});expect(a.price).toBe(2770000000);
 await expect(store('orders/'+a.id,'PUT',{...a,status:'confirmed'})).rejects.toThrow();await login();const car=await store('cars/1');
 await store('orders/'+a.id,'PUT',{...a,status:'confirmed'});expect((await store('cars/1')).stock).toBe(car.stock-1);
 const cancelled=await store('orders/'+a.id,'PUT',{...a,status:'cancelled'});expect((await store('cars/1')).stock).toBe(car.stock);
 await expect(store('orders/'+a.id,'PUT',cancelled)).rejects.toThrow();expect((await store('cars/1')).stock).toBe(car.stock);
});
test('lịch lái thử trùng chỉ xác nhận được một lịch',async()=>{
 await login('customer');const date=new Date(Date.now()+3*86400000);date.setUTCHours(3,0,0,0);const data={...contact,slot:date.toISOString()};const a=await store('testdrives','POST',data);const b=await store('testdrives','POST',data);await login();await store('testdrives/'+a.id,'PUT',{...a,status:'confirmed'});await expect(store('testdrives/'+b.id,'PUT',{...b,status:'confirmed'})).rejects.toThrow(/khung giờ/);
});
test('chặn xóa danh mục tham chiếu và tài khoản có nghiệp vụ',async()=>{
 await login();await expect(store('brands/1','DELETE')).rejects.toThrow();await login('customer');await store('consultations','POST',{...contact,content:'Tư vấn'});await expect(store('users/3','DELETE')).rejects.toThrow();
});
test('đơn hết tồn không được xác nhận và lỗi không làm đổi tồn đã lưu',async()=>{
 await login();const car=await store('cars/1');await store('cars/1','PUT',{...car,stock:0});await login('customer');const order=await store('orders','POST',contact);await login();await expect(store('orders/'+order.id,'PUT',{...order,status:'confirmed'})).rejects.toThrow();expect((await store('cars/1')).stock).toBe(0);expect((await store('orders/'+order.id)).status).toBe('pending');
});
test('đăng ký và đổi mật khẩu lưu băm, không lưu mật khẩu rõ',async()=>{
 await store('register','POST',{name:'Mới',email:'hash@test.local',password:'Initial123!'});
 let raw=loadStore().users.find(x=>x.email==='hash@test.local');expect(raw.password).toBeUndefined();expect(raw.passwordHash).toContain(':');
 await store('login','POST',{email:'hash@test.local',password:'Initial123!'});const me=await store('me');expect(me.passwordHash).toBeUndefined();
 await store('users/'+me.id,'PUT',{...me,password:'Changed123!'});await expect(store('login','POST',{email:me.email,password:'Initial123!'})).rejects.toThrow();
 await store('login','POST',{email:me.email,password:'Changed123!'});
});
test('khách hủy được lịch đã xác nhận nhưng không đổi giờ của lịch',async()=>{
 await login('customer');const day=new Date(Date.now()+4*86400000);day.setUTCHours(3,0,0,0);
 const a=await store('testdrives','POST',{...contact,slot:day.toISOString()});await login();const b=await store('testdrives/'+a.id,'PUT',{...a,status:'confirmed'});
 await login('customer');await expect(store('testdrives/'+a.id,'PUT',{...b,status:'cancelled',phone:'0987654321'})).rejects.toThrow();
 const cancelled=await store('testdrives/'+a.id,'PUT',{...b,status:'cancelled'});expect(cancelled.status).toBe('cancelled');
});
test('tư vấn chung không bắt buộc mẫu xe; chỉ nhân viên ghi kết quả',async()=>{
 await login('customer');const a=await store('consultations','POST',{name:'Khách',phone:'0912345678',content:'Cần tư vấn',note:'Khách tự ghi kết quả'});expect(a.car_id).toBeNull();expect(a.note).toBe('');
 await login();const b=await store('consultations/'+a.id,'PUT',{...a,status:'processing',note:'Đã gọi'});expect(b.note).toBe('Đã gọi');
 await store('consultations/'+a.id,'PUT',{...b,status:'completed'});await expect(store('consultations/'+a.id,'DELETE')).rejects.toThrow();
});
test('CRUD hãng có mô tả/logo, và chặn danh mục ngừng hoạt động',async()=>{
 await login();const brand=await store('brands','POST',{name:'Hãng mới',description:'Mô tả',logo:'/images/carstore-logo.png',active:0});expect(brand.description).toBe('Mô tả');expect(brand.logo).toContain('logo');
 const car=await store('cars/1');await expect(store('cars','POST',{...car,id:undefined,code:'NEW',brand_id:brand.id})).rejects.toThrow();
});
test('tài khoản bị khóa không tạo được yêu cầu',async()=>{
 await login();const u=await store('users/3');await store('users/3','PUT',{...u,active:0});await expect(login('customer')).rejects.toThrow();
});
test('CRUD xe đầy đủ và không xóa xe đã có đơn',async()=>{
 await login();const original=await store('cars/1');const newCar=await store('cars','POST',{...original,code:'LABNEW',name:'Xe thử',stock:1});expect(newCar.id).toBe(31);
 const updated=await store('cars/'+newCar.id,'PUT',{...newCar,price:1000000000,stock:2});expect(updated.stock).toBe(2);expect(updated.price).toBe(1000000000);
 await store('cars/'+newCar.id,'DELETE');await expect(store('cars/'+newCar.id)).rejects.toThrow();
 await login('customer');await store('orders','POST',contact);await login();await expect(store('cars/1','DELETE')).rejects.toThrow();
});
test('email không hợp lệ, mật khẩu ngắn và giá/tồn không hợp lệ bị chặn',async()=>{
 await expect(store('register','POST',{name:'Test',email:'invalid',password:'12345678'})).rejects.toThrow();
 await expect(store('register','POST',{name:'Test',email:'valid@test.local',password:'short'})).rejects.toThrow();
 await login();const car=await store('cars/1');await expect(store('cars/1','PUT',{...car,stock:-1})).rejects.toThrow();await expect(store('cars/1','PUT',{...car,price:0})).rejects.toThrow();
});
test('giá đơn không thay khi xe đổi giá, đơn hoàn tất không sửa/xóa',async()=>{
 await login('customer');const a=await store('orders','POST',contact);await login();const car=await store('cars/1');await store('cars/1','PUT',{...car,price:9000000000});expect((await store('orders/'+a.id)).price).toBe(a.price);
 const b=await store('orders/'+a.id,'PUT',{...a,status:'confirmed'});const done=await store('orders/'+a.id,'PUT',{...b,status:'completed'});
 await expect(store('orders/'+a.id,'PUT',{...done,status:'cancelled'})).rejects.toThrow();await expect(store('orders/'+a.id,'DELETE')).rejects.toThrow();expect((await store('cars/1')).stock).toBe(car.stock-1);
});
test('lịch quá khứ hoặc xe không lái thử bị chặn',async()=>{
 await login('customer');await expect(store('testdrives','POST',{...contact,slot:'2020-01-01T03:00:00Z'})).rejects.toThrow();
 await login();const car=await store('cars/1');await store('cars/1','PUT',{...car,test_drive:0});await login('customer');const day=new Date(Date.now()+4*86400000);day.setUTCHours(3,0,0,0);await expect(store('testdrives','POST',{...contact,slot:day.toISOString()})).rejects.toThrow();
});
