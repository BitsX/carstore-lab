import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {money,storeRequest} from '../services/carStoreService';
export default function DashboardPage() {
  const [data,setData] = useState(null),[error,setError] = useState('');
  useEffect(() => {Promise.all(['cars','consultations','testdrives','orders'].map(t=>storeRequest(t))).then(setData).catch(e=>setError(e.message));},[]);
  if(error)return <p className="error">{error}</p>;
  if(!data)return <p>Đang tải tổng quan...</p>;
  const [cars,consultations,drives,orders] = data;
  return <><div className="page-heading"><div><p className="eyebrow">CARSTORE / QUẢN LÝ</p><h1>Tổng quan cửa hàng</h1><p>Theo dõi xe và yêu cầu khách hàng trong trình duyệt này.</p></div></div>
    <div className="stats-grid">{[['Xe đang kinh doanh',cars.filter(c=>c.active).length,'cars'],['Tư vấn mới',consultations.filter(r=>r.status==='new').length,'consultations'],['Lái thử chờ xác nhận',drives.filter(r=>r.status==='pending').length,'testdrives'],['Đơn mua chờ xác nhận',orders.filter(r=>r.status==='pending').length,'orders']].map(([label,count,path])=><Link className="panel stat" to={'/admin/'+path} key={path}><span>{label}</span><strong>{count}</strong><span>Xem chi tiết →</span></Link>)}</div>
    <div className="panel"><h2>Đơn đã hoàn tất</h2><p className="price">{money(orders.filter(r=>r.status==='completed').reduce((sum,r)=>sum+r.price,0))}</p><p className="muted">Tổng giá trị yêu cầu đặt mua được đánh dấu hoàn tất, không phải doanh thu thanh toán thực tế.</p></div>
  </>;
}
