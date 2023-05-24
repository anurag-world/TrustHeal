function dateformatter(date) {
  var dateArr = date.split("-");
  //console.log(dateArr);
  var out = "";
  for (var i = dateArr.length - 1; i >= 0; --i) out += dateArr[i] + "-";

  return out.substring(0, out.length - 1);
}

export default dateformatter;
