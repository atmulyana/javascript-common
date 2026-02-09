/**
 * https://github.com/atmulyana/javascript-common
 */
const {isPlainObject, objEquals} = require('../');

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
});