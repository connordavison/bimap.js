const InvalidMappingError = require('./InvalidMappingException');

/**
 * @template K, V
 */
module.exports = class BiMap {
    /**
     * @param {Map<K, V>} map
     * @param {Map<V, K>} inverseMap
     */
    constructor(map, inverseMap) {
        this.map = map;
        this.inverseMap = inverseMap;
    }

    /**
     * @returns {BiMap}
     */
    static create() {
        return new BiMap(new Map(), new Map());
    }

    /**
     * @returns {number}
     */
    get size() {
        return this.map.size;
    }

    /**
     * @param {K} key
     * @param {V} value
     */
    set(key, value) {
        const oldValue = this.map.get(key);

        if (this.inverseMap.has(value)
            && this.inverseMap.get(value) !== key
        ) {
            throw new InvalidMappingError();
        }

        this.inverseMap.delete(oldValue);
        this.map.set(key, value);
        this.inverseMap.set(value, key);

        return this;
    }

    clear() {
        this.map.clear();
        this.inverseMap.clear();
    }

    /**
     * @param {K} key
     * @returns {boolean}
     */
    delete(key) {
        const value = this.map.get(key);
        const deleted = this.map.delete(key);
        const inverseDeleted = this.inverseMap.delete(value);

        return deleted || inverseDeleted;
    }

    /**
     * @returns IterableIterator<[K, V]>
     */
    entries() {
        return this.map.entries();
    }

    /**
     * @param {(value: V, key: K, map: Map<K, V>) => void} callbackFn
     * @param {any} [thisArg]
     */
    forEach(callbackFn, thisArg) {
        return this.map.forEach(callbackFn, thisArg);
    }

    /**
     * @param {K} key
     * @returns {(V|undefined)}
     */
    get(key) {
        return this.map.get(key);
    }

    /**
     * @param {K} key
     * @returns {boolean}
     */
    has(key) {
        return this.map.has(key);
    }

    /**
     * @returns {IterableIterator<K>}
     */
    keys() {
        return this.map.keys();
    }

    /**
     * @returns {BiMap<V, K>}
     */
    inverse() {
        return new BiMap(this.inverseMap, this.map);
    }

    /**
     * @returns {IterableIterator<V>}
     */
    values() {
        return this.inverseMap.keys();
    }

    /**
     * @generator
     * @yields {[K, V]}
     */
    *[Symbol.iterator]() {
        yield* this.map;
    }
}
