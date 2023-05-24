export default function dateformatter(date) {
  const dateArr = date.split('-');
  // console.log(dateArr);
  let out = '';
  for (let i = dateArr.length - 1; i >= 0; i -= 1) out += `${dateArr[i]}-`;

  return out.substring(0, out.length - 1);
}
