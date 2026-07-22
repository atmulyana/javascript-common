/**
 * https://github.com/atmulyana/javascript-common
 */
'use strict';

const noop = () => {};
const noChange = p => p;
const emptyArray = Object.freeze([]);
const emptyObject = Object.freeze({});
const emptyString = '';

function isPlainObject(o) {
    let proto;
    return typeof(o) == 'object' && o
        && (proto = Object.getPrototypeOf(o), proto.constructor) === Object
        && Object.getPrototypeOf(proto) === null;
}

function objEquals(o1, o2, opts = emptyObject) {
    const {
        equals = Object.is,
        allProps = true,
        arrayCheck = true,
    } = opts;

    return (arrayCheck ? arrayEquals(o1, o2, opts) : null) ?? (function() {
        if (equals(o1, o2)) return true;
        if (isPlainObject(o1) && isPlainObject(o2)) {
            const getKeys = allProps ? Object.getOwnPropertyNames : Object.keys;
            const keys = getKeys(o1);
            if (keys.length != getKeys(o2).length) return false;
            for (let p of keys) {
                if ((p in o2) && objEquals(o1[p], o2[p], opts)) continue;
                return false;
            }
            return true;
        }
        return false;
    })();
}

function arrayEquals(ar1, ar2, opts = emptyObject) {
    const {
        arrayLike,
        equals = Object.is,
        iterable,
    } = opts;
    const opt = {...opts, arrayCheck: true};
    
    if (iterable && typeof(ar1?.[Symbol.iterator]) == 'function' && typeof(ar1?.[Symbol.iterator]) == 'function') {
        if (equals(ar1, ar2)) return true;
        const iter1 = ar1[Symbol.iterator](),
              iter2 = ar2[Symbol.iterator]();
        while (true) {
            const res1 = iter1.next(),
                  res2 = iter2.next();
            if (res1.done && res2.done) {
               return objEquals(res1.value, res2.value, opt);
            }
            else if (res1.done) {
                iter2.return?.();
            }
            else if (res2.done) {
                iter1.return?.();
            }
            else { //if (!res1.done && !res2.done)
                if (objEquals(res1.value, res2.value, opt)) continue;
                iter1.return?.();
                iter2.return?.();
            }
            return false;
        }
    }

    const isArray = arrayLike ? arrayEquals.isArray : Array.isArray;
    if (isArray(ar1) && isArray(ar2)) {
        if (equals(ar1, ar2)) return true;
        if (ar1.length != ar2.length) return false;
        for (let i = 0; i < ar1.length; i++) {
            if (objEquals(ar1[i], ar2[i], opt)) continue;
            return false;
        }
        return true;
    }
    return null;
}
arrayEquals.isArray = (ar) => typeof(ar?.length) == 'number' && ar.length >= 0;

const extendObject = (target, extObj) => (
    target = target === null || target === undefined ? {} : target,
    extObj = extObj === null || extObj === undefined ? {} : extObj,
    Object.setPrototypeOf(extObj, target),
    extObj
);

const getTargetSymbol = Symbol('proxyObject-getTarget');
function proxyObject(target, extObj, proxiedIfNotExist = false) {
    target = target === null || target === undefined ? {} : target;
    let $proxy = typeof(extObj) == 'function' ? extObj(target) : extObj;
    $proxy = $proxy === null || $proxy === undefined ? {} : $proxy;
    
    function getValue(obj, prop) {
        const val = obj[prop];
        if (typeof(val) == 'function') {
            return (...args) => {
                return val.apply(obj, args);
            }
        }
        else {
            return val;
        }
    }

     function getTarget(
        _target, //It's the actual proxied object `{[getTargetSymbol]: getTarget}`
        prop
    ) {
        if ( (prop in $proxy) && (!proxiedIfNotExist || !(prop in target)) ) {
            return $proxy;
        }
        else if (getTargetSymbol in target) { //`target` is also an object yielded by `proxyObject` function
            return target[getTargetSymbol](target, prop);
        }
        return target;
    }

    function get(_target/*It's the actual proxied object `{[getTargetSymbol]: getTarget}`*/, prop) {
        if (prop == '__proto__') return target;
        if (prop === getTargetSymbol) { //Because `target[getTargetSymbol]` is invoked
            return _target[getTargetSymbol];
        }
        const $target = getTarget(_target, prop);
        return getValue($target, prop);
    }

    function set(_target, prop, value) {
        const $target = getTarget(_target, prop);
        $target[prop] = value;
        return true;
    }

    function has(_target, prop) {
        if (prop === getTargetSymbol) return true;
        return (prop in target) || (prop in $proxy);
    }

    return new Proxy(
        {
            [getTargetSymbol]: getTarget,
        },
        {
            get,
            set,
            has,
            getPrototypeOf(_target) {
                return target;
            }
        }
    );
}

function proxyClass(Target, extObj, proxiedIfNotExist = false) {
    return new Proxy(Target, {
        construct(Target, args) {
            const target = new Target(...args);
            return proxyObject(target, extObj, proxiedIfNotExist);
        }
    });
}

if (typeof(module) == 'object' && module) module.exports = {
    noop,
    noChange,
    emptyArray,
    emptyObject,
    emptyString,
    isPlainObject,
    objEquals,
    arrayEquals,
    extendObject,
    proxyObject,
    proxyClass,
};