export function checkAlphanumicOnly(text) {
  const regEx = /^[0-9a-zA-Z\s]+$/;
  if (!text.match(regEx)) {
    return false;
  }
  return true;
}

export function checkAlphabetOnly(text) {
  const regEx = /^[a-z\s]+$/i;
  if (!text.match(regEx)) {
    return false;
  }
  return true;
}
