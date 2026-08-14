export const slugify = (text) => {
  return text
    .toString()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '') 
    .replace(/-+/g, '-'); 
};