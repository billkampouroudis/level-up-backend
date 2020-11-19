export const defaultMinLength = 1;
export const defaultMaxLength = 100;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const nameRegex = /^([^.<>!@#$+()/%&=*_-][^0-9]*)$/;
// eslint-disable-next-line no-useless-escape
export const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
export const defaultFileTypes = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
  'image/bmp',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
  'application/x-7z-compressed',
  'application/zip',
  'application/vnd.rar'
];
export const defaultMaxFileSize = 20000000; //bytes
export const defaultMessageLength = 2500;

export const defaultPasswordLength = 8;
