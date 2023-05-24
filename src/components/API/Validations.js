export function checkAlphanumicOnly(text) {
  var regEx = /^[0-9a-zA-Z\s]+$/;
  if (!text.match(regEx)) {
    return false;
  } else return true;
}

export function checkAlphabetOnly(text) {
  var regEx = /^[a-z\s]+$/i;
  if (!text.match(regEx)) {
    return false;
  } else return true;
}
