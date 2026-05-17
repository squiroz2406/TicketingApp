export function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sample(items, count) {
  const copy = items.slice();
  const selected = [];
  while (selected.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(index, 1)[0]);
  }
  return selected;
}
