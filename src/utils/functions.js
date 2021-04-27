export const randomString = (length, chars) => {
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
  let result = '';
  for (let i = length; i > 0; i -= 1) result += mask[Math.floor(Math.random() * mask.length)];
  return result;
};

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function toSelectArray(obj) {
  const list = [];
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i += 1) {
    list.push({ value: keys[i], label: obj[keys[i]] });
  }
  return list;
}

export function getRandomObjectKeyname(obj) {
  const keys = Object.keys(obj);
  // eslint-disable-next-line no-bitwise
  return keys[keys.length * Math.random() << 0];
}

export function getRandomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomByDict(length, chars) {
  let result = '';
  // eslint-disable-next-line no-plusplus
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}
