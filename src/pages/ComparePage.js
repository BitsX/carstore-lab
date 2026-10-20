import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {useCompare} from '../context/CompareContext';
import {money, storeRequest} from '../services/carStoreService';
export default function ComparePage() {
  const {ids,remove,clear} = useCompare();
  const [cars,setCars] = useState([]), [types,setTypes] = useState([]), [error,setError] = useState('');
  useEffect(() => {Promise.all([storeRequest('cars'),storeRequest('types')]).then(([c,t]) => {setCars(c);setTypes(t);}).catch(e => setError(e.message));}, []);
  const selected = ids.map(id => cars.find(c => c.id===id && c.active)).filter(Boolean);
  const rows = [['Giá tham khảo',c => money(c.price)],['Năm',c => c.year],['Kiểu dáng',c => types.find(t => t.id===c.type_id)?.name || '—'],['Nhiên liệu',c => c.fuel],['Hộp số',c => c.transmission],['Số chỗ',c => c.seats],['Tồn khả dụng',c => c.stock],['Hỗ trợ lái thử',c => c.test_drive ? 'Có' : 'Không'],['Mô tả',c => c.specs]];
  return <><div className="page-heading"><div><p className="eyebrow">TÌM LỰA CHỌN PHÙ HỢP</p><h1>So sánh xe</h1><p>Chọn từ 2 đến 3 xe ở trang bộ sưu tập để đối chiếu.</p></div><div className="actions"><Link className="button" to="/cars">Chọn xe</Link>{ids.length > 0 && <button className="secondary" onClick={clear}>Bỏ tất cả</button>}</div></div>
    {error && <p className="error">{error}</p>}
    {selected.length === 0 ? <div className="empty">Chưa có xe đang kinh doanh trong danh sách so sánh.</div> : <><p className="muted">{selected.length < 2 ? 'Hãy chọn thêm ít nhất một xe để so sánh.' : 'Giá và thông số dưới đây là dữ liệu minh họa.'}</p><div className="table-wrap comparison"><table><thead><tr><th>Tiêu chí</th>{selected.map(c => <th key={c.id}><img src={c.image} alt={c.name}/><h2>{c.name}</h2><button className="secondary" onClick={() => remove(c.id)}>Bỏ xe</button></th>)}</tr></thead><tbody>{rows.map(([name,get]) => <tr key={name}><th>{name}</th>{selected.map(c => <td key={c.id}>{get(c)}</td>)}</tr>)}<tr><th>Khám phá</th>{selected.map(c => <td key={c.id}><Link to={'/cars/'+c.id}>Xem chi tiết →</Link></td>)}</tr></tbody></table></div></>}
  </>;
}
