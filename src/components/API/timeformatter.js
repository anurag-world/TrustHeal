function timeformatter(time) {
  let text = time;
  const myArray = text.split(':');
  var HH = Number(myArray[0]);
  var m = Number(myArray[1]);
  var MM = m;
  if (m <= 9) MM = '0' + m;
  var PM = 'AM';
  if (HH > 12) {
    HH -= 12;
    PM = 'PM';
  } else if (HH == 12) {
    PM = 'PM';
  }

  if (HH == 0) HH = 12;
  if (HH < 10) HH = '0' + HH;

  return HH + ':' + MM + PM;
}

export default timeformatter;
