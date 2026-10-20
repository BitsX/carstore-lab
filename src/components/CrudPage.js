import {useCallback, useEffect, useState} from 'react';
import {storeRequest, money} from '../services/carStoreService';
import {labels} from './fields';

// Bảng CRUD chung: page truyền danh sách cột, trường nhập và quyền thao tác.
export default function CrudPage({resource, title, fields, columns, defaults = {}, canCreate = true, canDelete = true, allowEdit = () => true, allowDelete = () => true, extraAction, detailFields = []}) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const load = useCallback(async () => setRows(await storeRequest(resource)), [resource]);
  useEffect(() => {load().catch(e => setError(e.message));}, [load]);
  const currentFields = typeof fields === 'function' ? fields(form) : fields;

  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      await storeRequest(resource + (form.id ? '/' + form.id : ''), form.id ? 'PUT' : 'POST', form);
      setForm(null); setMessage('Đã lưu dữ liệu.'); await load();
    } catch (e) {setError(e.message);} finally {setBusy(false);}
  }
  async function remove(row) {
    if (!window.confirm('Bạn muốn xóa hồ sơ #' + row.id + '?')) return;
    setError(''); setMessage('');
    try {await storeRequest(resource + '/' + row.id, 'DELETE'); await load(); setMessage('Đã xóa hồ sơ.');}
    catch (e) {setError(e.message);}
  }
  async function action(row) {
    setError('');
    try {await extraAction.run(row); await load(); setMessage('Đã cập nhật trạng thái.');}
    catch (e) {setError(e.message);}
  }
  function value(row, column) {
    if (column.render) return column.render(row);
    if (column.key === 'price') return money(row.price);
    if (column.key === 'status') return labels[row.status];
    return String(row[column.key] ?? '—');
  }
  const visible = rows.filter(row => JSON.stringify(row).toLowerCase().includes(query.toLowerCase()));
  return <section>
    <div className="page-heading"><div><p className="eyebrow">CARSTORE / QUẢN LÝ</p><h1>{title}</h1><p>{rows.length} hồ sơ trong hệ thống</p></div>{canCreate && <button onClick={() => {setError(''); setForm({...defaults});}}>+ Thêm mới</button>}</div>
    {error && <p className="error" role="alert">{error}</p>}
    {message && <p className="success" role="status">{message}</p>}
    {form && <form className="panel edit-form" onSubmit={save}><h2>{form.id ? 'Cập nhật #' + form.id : 'Thêm mới'}</h2><div className="form-grid">
      {currentFields.filter(f => !f.onlyCreate || !form.id).map(f => <label key={f.key}>{f.label}{f.required !== false && <span className="required"> *</span>}
        {f.options ? <select required={f.required !== false} disabled={f.disabled} value={form[f.key] ?? ''} onChange={e => setForm({...form, [f.key]: e.target.value})}>
          <option value="">-- Chọn --</option>{f.options.map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}
        </select> : f.type === 'textarea' ? <textarea required={f.required !== false} value={form[f.key] ?? ''} onChange={e => setForm({...form, [f.key]: e.target.value})}/> :
          <input required={f.required !== false} disabled={f.disabled} type={f.type || 'text'} min={f.min} max={f.max} step={f.type === 'number' ? 1 : undefined} value={f.type === 'datetime-local' && form[f.key] ? localTime(form[f.key]) : form[f.key] ?? ''} onChange={e => setForm({...form, [f.key]: f.type === 'datetime-local' ? (e.target.value ? new Date(e.target.value).toISOString() : '') : e.target.value})}/>}
        {f.help && <small>{f.help}</small>}
      </label>)}
    </div><div className="actions"><button disabled={busy}>{busy ? 'Đang lưu...' : 'Lưu thay đổi'}</button><button className="secondary" type="button" onClick={() => setForm(null)}>Đóng</button></div></form>}
    <div className="table-toolbar"><input aria-label="Tìm trong bảng" placeholder="Tìm theo mã, khách hàng, nội dung..." value={query} onChange={e => setQuery(e.target.value)}/><span>{visible.length} kết quả</span></div>
    <div className="table-wrap"><table><thead><tr><th>Mã</th>{columns.map(c => <th key={c.key}>{c.label}</th>)}<th>Thao tác</th></tr></thead><tbody>
      {visible.map(row => <tr key={row.id}><td>#{row.id}</td>{columns.map(c => <td key={c.key}>{value(row, c)}</td>)}<td><div className="row-actions">
        <button className="secondary" onClick={() => setDetail(row)}>Chi tiết</button>
        {allowEdit(row) && <button onClick={() => {setError(''); setForm({...row, password: ''}); window.scrollTo(0, 0);}}>Sửa</button>}
        {canDelete && allowDelete(row) && <button className="danger" onClick={() => remove(row)}>Xóa</button>}
        {extraAction && extraAction.visible(row) && <button className="danger" onClick={() => action(row)}>{extraAction.label}</button>}
      </div></td></tr>)}
    </tbody></table>{visible.length === 0 && <div className="empty">Chưa có dữ liệu phù hợp.</div>}</div>
    {detail && <div className="modal-backdrop"><section className="panel modal" role="dialog" aria-modal="true" aria-label={'Chi tiết #' + detail.id}><h2>Chi tiết hồ sơ #{detail.id}</h2><dl className="detail-list">
      {[...columns, ...detailFields.filter(f => !columns.some(c => c.key === f.key))].map(c => <div key={c.key}><dt>{c.label}</dt><dd>{value(detail, c)}</dd></div>)}
    </dl><button onClick={() => setDetail(null)}>Đóng chi tiết</button></section></div>}
  </section>;
}
function localTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
