type TInsertInput = {
  str: string;
  index: number;
  value: string;
};
export function insert({ str, index, value }: TInsertInput) {
  const s = str.substring(0, index);
  const e = str.substring(index);
  return `${s}${value}${e}`;
}

export function isImage(filename?: string) {
  if (!filename) {
    return false;
  }
  return /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(filename);
}
