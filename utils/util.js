import dayjs from 'dayjs';

const formatTime = (date, template) => dayjs(date).format(template);

const sub7day = (date) => dayjs(date).subtract(7, 'day').format('YYYY.MM.DD')

module.exports = {
  formatTime,
  sub7day
};
