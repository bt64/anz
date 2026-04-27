export const formatNum = (num: number, len: number) => {
  const digits = Math.round(num).toString().length;
  return num.toFixed(Math.max(0, len - digits));
};
