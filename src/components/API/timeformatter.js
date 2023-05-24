export default function timeformatter(time) {
  const text = time;
  const myArray = text.split(':');
  let HH = Number(myArray[0]);
  const m = Number(myArray[1]);
  let MM = m;
  if (m <= 9) MM = `0${m}`;
  let PM = 'AM';
  if (HH > 12) {
    HH -= 12;
    PM = 'PM';
  } else if (HH === 12) {
    PM = 'PM';
  }

  if (HH === 0) HH = 12;
  if (HH < 10) HH = `0${HH}`;

  return `${HH}:${MM}${PM}`;
}
