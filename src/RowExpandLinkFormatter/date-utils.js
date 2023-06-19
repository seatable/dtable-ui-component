class DateUtils {
  static format(date, format) {
    const dateObject = this.getValidDate(date);
    if (!dateObject) {
      return date;
    }
    const upperCaseFormat = format && format.toUpperCase();
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();
    const displayMonth = month < 10 ? `0${month}` : month;
    const displayDay = day < 10 ? `0${day}` : day;
    switch (upperCaseFormat) {
      case 'YYYY-MM-DD HH:MM:SS': {
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const seconds = dateObject.getSeconds();
        const displayHours = hours < 10 ? `0${hours}` : hours;
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
        return `${year}-${displayMonth}-${displayDay} ${displayHours}:${displayMinutes}:${displaySeconds}`;
      }
      case 'YYYY-MM-DD HH:MM':
      case 'YYYY-MM-DD HH:mm': {
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const displayHours = hours < 10 ? `0${hours}` : hours;
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${year}-${displayMonth}-${displayDay} ${displayHours}:${displayMinutes}`;
      }
      case 'D/M/YYYY':
      case 'DD/MM/YYYY': {
        return `${displayDay}/${displayMonth}/${year}`;
      }
      case 'D/M/YYYY HH:mm':
      case 'DD/MM/YYYY HH:mm': {
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const displayHours = hours < 10 ? `0${hours}` : hours;
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${displayDay}/${displayMonth}/${year} ${displayHours}:${displayMinutes}`;
      }
      case 'M/D/YYYY': {
        return `${month}/${day}/${year}`;
      }
      case 'M/D/YYYY HH:mm': {
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const displayHours = hours < 10 ? `0${hours}` : hours;
        const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${month}/${day}/${year} ${displayHours}:${displayMinutes}`;
      }
      case 'YYYY-MM-DD': {
        return `${year}-${displayMonth}-${displayDay}`;
      }
      default: {
        return `${year}-${displayMonth}-${displayDay}`;
      }
    }
  }

  static isValidDateObject(dateObject) {
    return dateObject instanceof Date && !isNaN(dateObject.getTime());
  }

  static getValidDate(date) {
    if (!date) {
      return null;
    }
    const isDateTypeString = typeof date === 'string';
    let dateObject = isDateTypeString ? new Date(date) : date;
    if (this.isValidDateObject(dateObject)) return dateObject;
    if (!isDateTypeString) return null;

    //ios phone and safari browser not support use '2021-09-10 12:30', support '2021/09/10 12:30'
    dateObject = new Date(date.replace(/-/g, '/'));
    if (this.isValidDateObject(dateObject)) return dateObject;
    return null;
  }
}

export default DateUtils;
