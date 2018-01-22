import isArray from 'lodash/fp/isArray';
import isNil from 'lodash/fp/isNil';

export default class Cache {
  constructor() {
    this.cache = {};
    this.ttl = 10 * 60 * 1000;
  }

  getKey(key) {
    const obj = this.cache[key];

    if(isNil(obj) || obj._expires > Date.now()) {
      return { key, miss: true };
    }

    return { key, value: obj.value };
  }

  getKeys(keys) {
    keys = isArray(keys) ? keys : [keys];

    return keys.map(this.getKey.bind(this));
  }

  setKey(key, value, ttl) {
    const _expires = Date.now() + (ttl || this.ttl);

    this.cache[key] = {
      value,
      _expires
    };
  }

  setKeys(pairs, ttl) {
    pairs.forEach(({ key, value }) => this.setKey(key, value, ttl));
  }
}