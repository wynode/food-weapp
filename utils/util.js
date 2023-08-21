import dayjs from 'dayjs';

const formatTime = (date, template) => dayjs(date).format(template);

module.exports = {
  formatTime
};