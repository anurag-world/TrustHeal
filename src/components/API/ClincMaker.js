export default function clinicMaker(item) {
  const clinc = [];
  let i = 0;
  while (i < item.length) {
    const p = {
      key: item[i].clinicId,
      value: `${item[i].clinicName} | ${item[i].clinicAddress}`,
    };
    clinc.push(p);
    i += 1;
  }
  return clinc;
}
