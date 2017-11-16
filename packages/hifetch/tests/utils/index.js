export const HOST = 'http://www.mydomain.com';
export const PORT = 8056;
export const ROOT = `${HOST}:${PORT}`;

export function checkFormData(body, handlers) {
  const rows = body.split(/(\r\n)+/);
  rows.forEach((row, i) => {
    Object.keys(handlers).forEach(key => {
      if (new RegExp(`name="${key}"`).test(row)) {
        handlers[key](rows[i + 2]);
      }
    });
  });
}
