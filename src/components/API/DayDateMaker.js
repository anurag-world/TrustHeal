export default function DayDateMaker(item) {
  const d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const days = [];
  const cd = item.availableDates === undefined ? item : item.availableDates;
  let i = 0;
  while (i < cd.length) {
    const p = {
      date: cd[i],
      day: d[new Date(cd[i]).getDay()],
    };
    days.push(p);
    i += 1;
  }
  return days;
}
