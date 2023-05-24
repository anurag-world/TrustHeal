export default function DaysCreator() {
  const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = [];
  let i = 0;
  const p = new Date().getDay();
  // if (p == 6) {
  //   i = 2;
  //   p = -1;
  // } else if (p == 5) {
  //   i = 3;
  //   p = -2;
  // }
  while (i <= 6) {
    const cur = new Date();
    cur.setDate(cur.getDate() + i);
    const day = d[(p + i) % 7];
    days.push({
      date: JSON.stringify(cur).substring(1, 11),
      day,
      active: false,
    });
    i += 1;
  }
  // console.log(days);
  return days;
}
