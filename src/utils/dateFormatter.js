import dayjs from 'dayjs';

export const formatDate = (isoString) => {
  if (!isoString) return '-';
  return dayjs(isoString).format('DD/MM/YYYY HH:mm');
};

export const formatDateOnly = (isoString) => {
  if (!isoString) return '-';
  return dayjs(isoString).format('DD/MM/YYYY');
};
