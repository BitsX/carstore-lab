import {Link} from 'react-router-dom';
import {money} from '../services/carStoreService';
import {useCompare} from '../context/CompareContext';
export default function CarCard({car, onError = () => {}}) {
  const {ids, toggle} = useCompare();
  function compare() {try {toggle(car.id); onError('');} catch(e) {onError(e.message);}}
  return <article className="car-card">
    <Link to={'/cars/' + car.id} className="car-photo"><img loading="lazy" src={car.image || '/images/carstore-logo.png'} alt={car.name}/><span className="year-tag">{car.year}</span></Link>
    <div className="car-card-body"><p className="eyebrow">{car.fuel} / {car.transmission}</p><h2><Link to={'/cars/' + car.id}>{car.name}</Link></h2>
      <p className="price">{money(car.price)}</p><p className="stock">{car.stock > 0 ? car.stock + ' xe khả dụng' : 'Tạm hết xe'} • {car.seats} chỗ</p>
      <div className="card-actions"><Link to={'/cars/' + car.id}>Khám phá xe →</Link><button className="compare-button" aria-pressed={ids.includes(car.id)} onClick={compare}>{ids.includes(car.id) ? '✓ Đã chọn' : '+ So sánh'}</button></div>
    </div>
  </article>;
}
