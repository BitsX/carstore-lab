import '@testing-library/jest-dom';
// jsdom không có WebCrypto; dùng WebCrypto Node chỉ cho môi trường kiểm thử.
const {webcrypto} = require('crypto');
const {TextEncoder,TextDecoder} = require('util');
Object.defineProperty(window, 'crypto', {value:webcrypto});
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
window.scrollTo = () => {};
