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
