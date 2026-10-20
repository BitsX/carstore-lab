import {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {money, storeRequest} from '../services/carStoreService';

export default function RequestCreate({resource, title, extra}) {
  const {user} = useAuth(), navigate = useNavigate(), [params] = useSearchParams();
  const [cars, setCars] = useState([]), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [form, setForm] = useState({car_id:params.get('car') || '', name:user.name, phone:user.phone || '', content:'', slot:''});
  useEffect(() => {storeRequest('cars').then(setCars).catch(e => setError(e.message));}, []);
  const change = e => setForm({...form, [e.target.name]:e.target.value});
  const car = cars.find(c => c.id === Number(form.car_id));
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    try {await storeRequest(resource, 'POST', {...form, ...(form.slot ? {slot:new Date(form.slot).toISOString()} : {})}); navigate('/my/' + resource);}
    catch (e) {setError(e.message);} finally {setBusy(false);}
  }
  return <div className="booking-layout"><form className="panel" onSubmit={submit}>
    <p className="eyebrow">CARSTORE / DỊCH VỤ</p><h1>{title}</h1>
    {error && <p className="error" role="alert">{error}</p>}
    <label>Chọn xe {resource === 'consultations' ? '(không bắt buộc)' : '*'}<select required={resource !== 'consultations'} name="car_id" value={form.car_id} onChange={change}>
      <option value="">{resource === 'consultations' ? 'Tư vấn chung' : '-- Chọn xe --'}</option>
      {cars.filter(c => c.active && (resource !== 'testdrives' || c.test_drive)).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
    </select></label>
    <label>Họ tên *<input required name="name" value={form.name} onChange={change}/></label>
    <label>Số điện thoại *<input required type="tel" pattern="[0-9]{10}" placeholder="10 chữ số" name="phone" value={form.phone} onChange={change}/></label>
    {extra === 'content' && <label>Nội dung tư vấn *<textarea required name="content" value={form.content} onChange={change}/></label>}
    {extra === 'slot' && <label>Ngày giờ lái thử *<input required type="datetime-local" name="slot" value={form.slot} onChange={change}/><small>Chọn đầu mỗi giờ từ 08:00 đến 16:00 Việt Nam; một lượt 1 giờ. Nên đặt múi giờ máy tính theo Việt Nam.</small></label>}
    {resource === 'orders' && <p className="muted">Đây là yêu cầu đặt mua. Nhân viên kiểm tra và xác nhận mới giữ xe. Chưa thanh toán trực tuyến.</p>}
    <button disabled={busy}>{busy ? 'Đang gửi...' : 'Gửi yêu cầu'}</button>
  </form><aside>{car ? <div className="panel car-summary"><img src={car.image} alt={car.name}/><h2>{car.name}</h2><p className="price">{money(car.price)}</p><p>{car.stock} xe khả dụng</p></div> : <div className="panel"><h2>Luôn sẵn sàng hỗ trợ</h2><p>Chọn mẫu xe để xem hình ảnh và giá tham khảo trước khi gửi yêu cầu.</p></div>}</aside></div>;
}
