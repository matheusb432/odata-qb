function toYyyyMmDd(date: Date): string {
  if (!date) return '';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${to00(month)}-${to00(day)}`;
}

function to00(value: number | string): string {
  if (!value) return '00';
  if (typeof value === 'string') value = parseInt(value, 10);

  return value < 10 ? `0${value}` : `${value}`;
}

export const dateUtil = {
  toYyyyMmDd,
};
