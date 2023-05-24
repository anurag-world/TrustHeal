function DaysCreator() {
  var d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var days = [];
  var i = 0;
  var p = new Date().getDay();
  // if (p == 6) {
  //   i = 2;
  //   p = -1;
  // } else if (p == 5) {
  //   i = 3;
  //   p = -2;
  // }
  while (i <= 6) {
    var cur = new Date();
    cur.setDate(cur.getDate() + i);
    var day = d[(p + i) % 7];
    days.push({
      date: JSON.stringify(cur).substring(1, 11),
      day: day,
      active: false,
    });
    ++i;
  }
  //console.log(days);
  return days;
}

export default DaysCreator;

// function DaysCreator(arr) {
//   var d = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   var days = [];
//   var i = 1;
//   var p = new Date("2022-12-17").getDay();
//   if (p == 6) {
//     i = 2;
//     p = -1;
//   }
//   while (p + i < 6) {
//     var cur = new Date("2022-12-17");
//     cur.setDate(cur.getDate() + i);
//     if (check(JSON.stringify(cur).substring(1, 11), arr)) ++i;
//     else {
//       var day = d[p + i];
//       days.push({
//         date: JSON.stringify(cur).substring(1, 11),
//         day: day,
//       });
//       ++i;
//     }
//   }
//   return days;
// }
// function check(date, arr) {
//   for (var i = 0; i < arr.length; ++i) {
//     if (date == arr[i]) return true;
//   }
//   return false;
// }

// let x = ["2022-12-20", "2022-12-21"];
// console.log(DaysCreator(x));
