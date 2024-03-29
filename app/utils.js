
//convert date to mm/dd format
exports.formatDate = (date) => {
  let d = new Date(date)
  let dateObj = d.toLocaleString().split('/')
  return dateObj[0] + '/' + dateObj[1]
}

exports.convertDateFormat = (dateString) => {
  const parts = dateString.split('/');
  const formattedDate = new Date(parts[2], parts[0] - 1, parts[1]);
  
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
  const day = String(formattedDate.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

exports.formatISOtoDisplayDate = (dateObject) => {
  const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateObject.getUTCDate().toString().padStart(2, '0');
  const year = dateObject.getUTCFullYear().toString();
  
  return `${month}/${day}/${year}`;
}

exports.getCurrentLocalISOStringDate = () => {
  const currentDate = new Date();
  const timezoneOffsetInMinutes = currentDate.getTimezoneOffset();
  const timezoneOffsetInMilliseconds = timezoneOffsetInMinutes * 60 * 1000;
  const localDate = new Date(currentDate.getTime() - timezoneOffsetInMilliseconds);
  return localISOString = localDate.toISOString().substring(0, 10);
}

exports.formatStringForDisplay = (string) => {
  const lowerCase = string.toLowerCase();
  const words = lowerCase.split(' ');
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  return capitalizedWords.join(' ');
}