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
        objEquals(obj3, obj1)
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

test("`objEquals` function with option `equals`", () => {
    let val1 = new Set(['1', '2', '3']),
        val2 = ['1', '2', '3'],
        val3 = new Set(['1', '2', '3']);
        val4 = {0: '1', 1: '2', 2: '3'};
        val5 = '123';
    const opts = {
        equals: (val1, val2) => {
            if (Array.isArray(val1)) val1 = new Set(val1);
            if (Array.isArray(val2)) val2 = new Set(val2);
            if ((val1 instanceof Set) && (val2 instanceof Set)) {
                return val1.isSupersetOf(val2) && val1.isSubsetOf(val2);
            }
            return Object.is(val1, val2);
        }
    };
    
    expect(
        objEquals(val1, val2, opts)
    ).toBe(true);
     expect(
        objEquals(val1, val3, opts)
    ).toBe(true);
     expect(
        objEquals(val1, val4, opts)
    ).toBe(false);
    expect(
        objEquals(val1, val5, opts)
    ).toBe(false);

    expect(
        objEquals(val1, val2)
    ).toBe(false);
     expect(
        objEquals(val1, val3)
    ).toBe(false);
     expect(
        objEquals(val1, val4)
    ).toBe(false);
    expect(
        objEquals(val1, val5)
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



test("`arrayEquals` function with `iterable` option", () => {
    const ar1 = ['a', 'b', 'c'], ar2 = ['a', 'b', 'c', 'd', 'e'],
          str1 = 'abc', str2 = 'abcde',
          set1 = new Set(ar1), set2 = new Set(ar2),
          iterableCheck = {iterable: true};
    
    expect(
        arrayEquals(ar1, str1)
    ).toBeNull();
    expect(
        arrayEquals(ar1, set1)
    ).toBeNull();
    expect(
        arrayEquals(set1, str1)
    ).toBeNull();

    expect(
        arrayEquals(ar1, str1, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(ar1, set1, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(set1, str1, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(str1, ar1, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(set1, ar1, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(str1, set1, iterableCheck)
    ).toBe(true);

    expect(
        arrayEquals(ar1, str2, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(ar1, set2, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(set1, str2, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(ar1, ar2, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(set1, set2, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(str1, str2, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(str2, ar1, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(set2, ar1, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(str2, set1, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(ar2, ar1, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(set2, set1, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(str2, str1, iterableCheck)
    ).toBe(false);

    const ar3 = []; ar2[1] = 'b';
    const ar4 = ['', 'b']
    const set3 = new Set(); set3.add('b');
    const set4 = new Set(); set3.add(undefined).add('b');
    expect(
        arrayEquals(ar3, set3, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(set3, ar3, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(ar3, set4, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(set4, ar3, iterableCheck)
    ).toBe(true);
    expect(
        arrayEquals(set4, ar4, iterableCheck)
    ).toBe(false);
    expect(
        arrayEquals(ar4, set4, iterableCheck)
    ).toBe(false);
});