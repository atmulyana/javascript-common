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
    return typeof(o) == 'object' && o && Object.getPrototypeOf(o).constructor === Object;
}

function objEquals(o1, o2) {
    if (isPlainObject(o1) && isPlainObject(o2)) {
        if (Object.keys(o1).length != Object.keys(o2).length) return false;
        for (var p in o1) {
            if (isPlainObject(o1[p]) && isPlainObject(o2[p])) {
                if (!objEquals(o1[p], o2[p])) return false;
            }
            else if (!Object.is(o1[p], o2[p])) return false;
        }
        return true;
    }
    return Object.is(o1, o2);
}

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
    extendObject,
    proxyObject,
    proxyClass,
};