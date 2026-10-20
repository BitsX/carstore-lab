import {render,screen,fireEvent} from '@testing-library/react';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {AuthProvider} from './context/AuthContext';
import {CompareProvider} from './context/CompareContext';
function app(path) {
 localStorage.clear(); sessionStorage.clear(); window.history.replaceState({},'',path);
 return render(<BrowserRouter future={{v7_startTransition:true,v7_relativeSplatPath:true}}><AuthProvider><CompareProvider><App/></CompareProvider></AuthProvider></BrowserRouter>);
}
test('trang chủ hiển thị xe Porsche từ bộ ảnh',async()=>{
 app('/');expect(await screen.findByRole('heading',{name:'Những mẫu xe nổi bật'})).toBeInTheDocument();
 expect(await screen.findByRole('heading',{name:'Porsche 911 Carrera GTS'})).toBeInTheDocument();
});
test('bộ lọc loại xe chỉ hiển thị SUV phù hợp',async()=>{
 app('/cars');await screen.findByRole('heading',{name:'Porsche 911 Carrera GTS'});
 fireEvent.change(screen.getByLabelText('Loại xe'),{target:{value:'2'}});
 expect(screen.queryByRole('heading',{name:'Porsche 911 Carrera GTS'})).not.toBeInTheDocument();
 expect(screen.getByRole('heading',{name:'Porsche Cayenne GTS'})).toBeInTheDocument();
});
test('thêm hai xe và mở bảng so sánh',async()=>{
 app('/cars');await screen.findByRole('heading',{name:'Porsche 911 Carrera GTS'});
 fireEvent.click(screen.getAllByRole('button',{name:'+ So sánh'})[0]);
 fireEvent.click(screen.getAllByRole('button',{name:'+ So sánh'})[0]);
 fireEvent.click(screen.getByRole('link',{name:'So sánh xe (2)'}));
 expect(await screen.findByRole('heading',{name:'So sánh xe'})).toBeInTheDocument();
 expect(await screen.findByText('Nhiên liệu')).toBeInTheDocument();expect(screen.getAllByRole('button',{name:'Bỏ xe'})).toHaveLength(2);
});
