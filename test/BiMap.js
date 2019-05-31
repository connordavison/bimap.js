const BiMap = require('../src/BiMap');
const InvalidMappingError = require('../src/InvalidMappingException');
const expect = require('chai').expect;

describe('BiMap', () => {
    let map = null;
    let inverse = null;

    beforeEach(() => {
        map = BiMap.create();
        inverse = map.inverse();
    });

    describe('#set', () => {
        it('should store and retrieve key/value pairs', () => {
            map.set('a', 1);
            inverse.set(2, 'b');

            expect(map.get('a')).to.equal(1);
            expect(inverse.get(1)).to.equal('a');
            expect(map.get('b')).to.equal(2);
            expect(inverse.get(2)).to.equal('b');
        });

        it('should error if value is already mapped', () => {
            map.set('a', 1);
            inverse.set(3, 'c');

            expect(() => map.set('b', 1)).to.throw(InvalidMappingError);
            expect(() => map.set('b', 3)).to.throw(InvalidMappingError);
            expect(() => map.set('c', 1)).to.throw(InvalidMappingError);
            expect(() => map.set('a', 3)).to.throw(InvalidMappingError);

            expect(() => inverse.set(2, 'a')).to.throw(InvalidMappingError);
            expect(() => inverse.set(2, 'c')).to.throw(InvalidMappingError);
            expect(() => inverse.set(1, 'c')).to.throw(InvalidMappingError);
            expect(() => inverse.set(3, 'a')).to.throw(InvalidMappingError);
        });

        it('should overwrite previously set keys', () => {
            map.set('a', 1);
            map.set('a', 2);

            expect(map.get('a')).to.equal(2);
            expect(inverse.get(2)).to.equal('a');
            expect(inverse.get(1)).to.equal(undefined);

            inverse.set(2, 'b');

            expect(inverse.get(2)).to.equal('b');
            expect(map.get('b')).to.equal(2);
            expect(map.get(1)).to.equal(undefined);
        });
    });

    describe('#get', () => {
        it('should return undefined if key not set', () => {
            expect(map.get('a')).to.equal(undefined);
            expect(inverse.get(1)).to.equal(undefined);
        });
    });

    describe('#clear', () => {
        it('should delete all entries', () => {
            map.set('a', 1);
            map.clear();

            expect(map.size).to.equal(0);
            expect(map.get('a')).to.equal(undefined);
            expect(map.get('b')).to.equal(undefined);
            expect(map.has('a')).to.be.false;
            expect(map.has('b')).to.be.false;
            expect(map.keys()).to.be.empty;

            expect(inverse.size).to.equal(0);
            expect(inverse.get(1)).to.equal(undefined);
            expect(inverse.get(2)).to.equal(undefined);
            expect(map.has(1)).to.be.false;
            expect(map.has(2)).to.be.false;
            expect(inverse.keys()).to.be.empty;
        });
    });

    describe('#delete', () => {
        it('should remove the mapping for the given key', () => {
            map.set('a', 1);
            inverse.set(2, 'b');

            const deleted = map.delete('a');

            expect(deleted).to.equal(true);
            expect(map.get('a')).to.equal(undefined);
            expect(map.get('b')).to.equal(2);
            expect(inverse.get(1)).to.equal(undefined);
            expect(inverse.get(2)).to.equal('b');

            const inverseDeleted = inverse.delete(2);

            expect(inverseDeleted).to.equal(true);
            expect(inverse.get(1)).to.equal(undefined);
            expect(inverse.get(2)).to.equal(undefined);
            expect(map.get('a')).to.equal(undefined);
            expect(map.get('b')).to.equal(undefined);
        });

        it('should do nothing if key is not mapped', () => {
            map.set('a', 1);
            inverse.set(2, 'b');

            const deleted = map.delete('c');

            expect(deleted).to.equal(false);
            expect(map.get('a')).to.equal(1);
            expect(map.get('b')).to.equal(2);
            expect(inverse.get(1)).to.equal('a');
            expect(inverse.get(2)).to.equal('b');

            const inverseDeleted = inverse.delete(3);

            expect(inverseDeleted).to.equal(false);
            expect(inverse.get(1)).to.equal('a');
            expect(inverse.get(2)).to.equal('b');
            expect(map.get('a')).to.equal(1);
            expect(map.get('b')).to.equal(2);
        });
    });
});
