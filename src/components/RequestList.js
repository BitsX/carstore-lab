import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import CrudPage from './CrudPage';
import {labels, statusField} from './fields';
import {storeRequest} from '../services/carStoreService';

// Read/Update/Delete cho tư vấn, lái thử, đơn mua; quyền được kiểm tra lại ở service.
export default function RequestList({resource, title, manage = false}) {
  const [cars, setCars] = useState([]), [error, setError] = useState('');
  useEffect(() => {storeRequest('cars').then(setCars).catch(e => setError(e.message));}, []);
  const start = resource === 'consultations' ? 'new' : 'pending';
  function fields(row) {
    const status = row?.status || start;
    const states = manage ? (resource === 'consultations' ? (status === 'new' ? ['new','processing','cancelled'] : ['processing','completed','cancelled']) : (status === 'pending' ? ['pending','confirmed','cancelled'] : ['confirmed','completed','cancelled'])) : [start, 'cancelled'];
    return [{key:'name', label:'Họ tên'}, {key:'phone', label:'Số điện thoại'},
      ...(resource === 'consultations' ? [{key:'content', label:'Nội dung', type:'textarea'}, ...(manage ? [{key:'note', label:'Ghi chú nhân viên', type:'textarea', required:false}] : [])] : resource === 'testdrives' ? [{key:'slot', label:'Ngày giờ lái thử', type:'datetime-local', help:'Đầu giờ 08:00–16:00 Việt Nam; mỗi lượt một giờ.'}] : []), statusField(states)];
  }
  async function cancel(row) {
    if (!window.confirm('Hủy lịch lái thử đã xác nhận này?')) return;
    await storeRequest(resource + '/' + row.id, 'PUT', {...row, status:'cancelled'});
  }
  const carName = row => cars.find(c => c.id === row.car_id)?.name || (row.car_id ? 'Xe #' + row.car_id : 'Tư vấn chung');
  return <>
    {!manage && <div className="actions"><Link className="button" to={'/' + resource + '/new'}>+ Tạo yêu cầu mới</Link></div>}
    {error && <p className="error">{error}</p>}
    <CrudPage resource={resource} title={title} fields={fields} canCreate={false}
      allowEdit={r => manage ? !['completed','cancelled'].includes(r.status) : r.status === start}
      allowDelete={r => r.status === start}
      extraAction={!manage && resource === 'testdrives' ? {label:'Hủy lịch', visible:r => r.status === 'confirmed', run:cancel} : undefined}
      columns={[{key:'car_id',label:'Xe',render:carName}, {key:'name',label:'Khách hàng'}, {key:'phone',label:'Điện thoại'},
        ...(resource === 'orders' ? [{key:'price',label:'Giá đã chốt'}] : resource === 'testdrives' ? [{key:'slot',label:'Giờ hẹn (VN)',render:r => new Date(r.slot).toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'})}] : [{key:'content',label:'Nội dung'}, {key:'note',label:'Ghi chú'}]),
        {key:'status',label:'Trạng thái',render:r => <span className={'status ' + r.status}>{labels[r.status]}</span>} ]}
      detailFields={[{key:'user_id',label:'Mã khách hàng'}, {key:'created_at',label:'Ngày gửi',render:r => r.created_at ? new Date(r.created_at).toLocaleString('vi-VN') : '—'}]}/>
  </>;
}
