const cache = new Map();
const TTL = 20 * 1000; // 20 sec

export function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

export function setCache(key, value) {
  cache.set(key, {
    value,
    expiry: Date.now() + TTL,
  });
}