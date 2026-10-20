// Định nghĩa chung cho select bật/tắt và trạng thái nghiệp vụ.
export const activeField={key:'active',label:'Trạng thái',options:[{value:1,label:'Đang hoạt động'},{value:0,label:'Ngừng hoạt động'}]};
export const labels={new:'Mới',processing:'Đang xử lý',pending:'Chờ xác nhận',confirmed:'Đã xác nhận',completed:'Hoàn thành',cancelled:'Đã hủy'};
export const statusField=values=>({key:'status',label:'Trạng thái xử lý',options:values.map(value=>({value,label:labels[value]}))});
