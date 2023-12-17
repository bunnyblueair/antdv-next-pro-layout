/**
 * 判断是否是图片
 * @param path 链接
 * @returns 布尔
 */
export function isImg(path: string): boolean {
  return /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path);
}

/**
 * 判断是否是链接
 * @param path 链接
 * @returns 布尔
 */
export function isUrl(path: string): boolean {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
}
