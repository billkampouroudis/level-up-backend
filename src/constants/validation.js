const rules = {
  defaultMinLength: 1,
  defaultMaxLength: 100,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  nameRegex: /^([^.<>!@#$+()/%&=*_-][^0-9]*)$/,
  // eslint-disable-next-line no-useless-escape
  phoneRegex: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  defaultFileTypes: [
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
  ],
  defaultMaxFileSize: 20000000, //bytes
  defaultMessageLength: 2500,

  defaultPasswordLength: 8
};

export default rules;
