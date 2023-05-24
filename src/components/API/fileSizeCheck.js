export default function checkSize(size) {
  if (size <= 2097152) return true;
  else return false;
}
