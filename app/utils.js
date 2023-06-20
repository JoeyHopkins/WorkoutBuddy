
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