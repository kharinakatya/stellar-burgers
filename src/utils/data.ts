export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const orderDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffTime = today.getTime() - orderDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes}`;

  let dayText = '';
  if (diffDays === 0) {
    dayText = 'Сегодня';
  } else if (diffDays === 1) {
    dayText = 'Вчера';
  } else if (diffDays > 1 && diffDays <= 5) {
    dayText = `${diffDays} дня назад`;
  } else if (diffDays > 5) {
    dayText = `${diffDays} дней назад`;
  } else {
    dayText = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });
  }

  return `${dayText}, ${time} i-GMT+${date.getTimezoneOffset() / -60}`;
};

export const formatOrderDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
