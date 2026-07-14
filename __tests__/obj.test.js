/**
 * https://github.com/atmulyana/javascript-common
 */
const {isPlainObject, objEquals, arrayEquals} = require('../');

test("`isPlainObject` function", () => {
    expect(isPlainObject(null)).toBeFalsy();
    expect(isPlainObject(true)).toBeFalsy();
    expect(isPlainObject(0)).toBeFalsy();
    expect(isPlainObject('string')).toBeFalsy();
    expect(isPlainObject(new String('string'))).toBeFalsy();
    expect(isPlainObject(new Date(0))).toBeFalsy();
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject({a: 1, b: 'b'})).toBeTruthy();
    expect(isPlainObject(new Object())).toBeTruthy();
    
    let obj = {};
    Object.setPrototypeOf(obj, {});
    expect(isPlainObject(obj)).toBeFalsy();
    class Obj {}
    obj = new Obj();
    expect(isPlainObject(obj)).toBeFalsy();
});

test("`objEquals` function", () => {
    expect(
        objEquals(null, {})
    ).toBe(false);
    expect(
        objEquals(new Date(0), {})
    ).toBe(false);
    expect(
        objEquals(new Date(0), new Date(0))
    ).toBe(false);
    expect(
        objEquals(0, 0)
    ).toBe(true);
    expect(
        objEquals({a: 1, b: 2}, {a: 1, b: 2, c: 3})
    ).toBe(false);
    expect(
        objEquals({a: 1, b: 2}, {a: 1, b: 2})
    ).toBe(true);
    expect(
        objEquals({a: 1, b: 2}, {b: 2, a: 1})
    ).toBe(true);
    expect(
        objEquals({a: 1, b: 0}, {a: 1, b: null})
    ).toBe(false);
    expect(
        objEquals(
            {
                a: 1,
                b: 2,
                c: {
                    d: 'd',
                    e: 'e',
                }
            },
            {
                a: 1,
                b: 2,
                c: {
                    d: 'd',
                    e: 'e',
                }
            }
        )
    ).toBe(true);
    expect(
        objEquals(
            {
                a: 1,
                b: 2,
                c: {
                    d: 'd',
                    e: 'e',
                }
            },
            {
                a: 1,
                b: 2,
                c: {
                    d: 'd',
                    e: 'e',
                    f: null,
                }
            }
        )
    ).toBe(false);
    expect(
        objEquals(
            {
                a: 1,
                b: 2,
                c: {
                    d: 'd',
                    e: 'e',
                }
            },
            {
                a: 1,
                b: 2,
                c: new Date(0),
            }
        )
    ).toBe(false);

    expect(
        objEquals(
            {a: 1, b: undefined},
            {a: 1, c: 3}
        )
    ).toBe(false);
});

test("`objEquals` function with option `allProps`", () => {
    let obj1 = {a: 1, b: 2, c: 3},
        obj2 = {a: 1, b: 2},
        obj3 = {a: 1, b: 2};
    Object.defineProperty(obj3, 'c', {value: 3, enumerable: false});
    
    expect(
        objEquals(obj1, obj2)
    ).toBe(false);
    expect(
        objEquals(obj1, obj3)
    ).toBe(true);
    expect(
        objEquals(obj2, obj3)
    ).toBe(false);

    expect(
        objEquals(obj1, obj2, {allProps: false})
    ).toBe(false);
    expect(
        objEquals(obj1, obj3, {allProps: false})
    ).toBe(false);
    expect(
        objEquals(obj2, obj3, {allProps: false})
    ).toBe(true);
});

test("`objEquals` function with option `arrayCheck`", () => {
    let ar1 = [1, 2],
        ar2 = ar1,
        ar3 = [1, 2];
    
    expect(
        objEquals({p: ar1}, {p: ar2})
    ).toBe(true);
     expect(
        objEquals({p: ar1}, {p: ar3})
    ).toBe(true);
     expect(
        objEquals({p: ar2}, {p: ar3})
    ).toBe(true);

    expect(
        objEquals({p: ar1}, {p: ar2}, {arrayCheck: false})
    ).toBe(true);
    expect(
        objEquals({p: ar1}, {p: ar3}, {arrayCheck: false})
    ).toBe(false);
    expect(
        objEquals({p: ar2}, {p: ar3}, {arrayCheck: false})
    ).toBe(false);
});

test("`arrayEquals` function", () => {
    expect(
        arrayEquals([], [])
    ).toBe(true);
    expect(
        arrayEquals([1], [1, 2])
    ).toBe(false);
    expect(
        arrayEquals([1, 2], [1, 2])
    ).toBe(true);
    expect(
        arrayEquals(
            [1, [1.1],      2],
            [1, [1.1, 1.2], 2]
        )
    ).toBe(false);
    expect(
        arrayEquals(
            [1, [1.1, 1.2], 2],
            [1, [1.1, 1.2], 2]
        )
    ).toBe(true);
    expect(
        arrayEquals(
            [1, [1.1, 1.2], 2],
            [1, [1.1, 1.2], 2],
            {arrayCheck: false}
        )
    ).toBe(true);
    expect(
        arrayEquals([null, undefined], [null, undefined])
    ).toBe(true);
    expect(
        arrayEquals([null, undefined], [undefined, null])
    ).toBe(false);

    expect(
        arrayEquals([], null)
    ).toBeNull();
    expect(
        arrayEquals([], 0)
    ).toBeNull();
    expect(
        arrayEquals(0, null)
    ).toBeNull();
    expect(
        arrayEquals(0, 0)
    ).toBeNull();
});

test("`arrayEquals` function with `arrayLike` option", () => {
    expect(
        arrayEquals(['a','b', 'c'], 'abc')
    ).toBeNull();
    expect(
        arrayEquals(['a','b', 'c'], {length: 3, 0: 'a', 1: 'b', 2: 'c'})
    ).toBeNull();
    expect(
        arrayEquals('abc', {length: 3, 0: 'a', 1: 'b', 2: 'c'})
    ).toBeNull();

    expect(
        arrayEquals(['a','b', 'c'], 'abc', {arrayLike: true})
    ).toBe(true);
    expect(
        arrayEquals(['a','b', 'c'], {length: 3, 0: 'a', 1: 'b', 2: 'c'}, {arrayLike: true})
    ).toBe(true);
    expect(
        arrayEquals('abc', {length: 3, 0: 'a', 1: 'b', 2: 'c'}, {arrayLike: true})
    ).toBe(true);

    expect(
        arrayEquals([], '')
    ).toBeNull();
    expect(
        arrayEquals([], {length: 0})
    ).toBeNull();
    expect(
        arrayEquals('', {length: 0})
    ).toBeNull();

    expect(
        arrayEquals(['a','b', 'c'], 'abc', {arrayLike: true})
    ).toBe(true);
    expect(
        arrayEquals([], {length: 0, 0: 'a', 1: 'b', 2: 'c'}, {arrayLike: true})
    ).toBe(true);
    expect(
        arrayEquals('', {length: 0}, {arrayLike: true})
    ).toBe(true);
});