/**
 * https://github.com/atmulyana/javascript-common
 */
'use strict';

const noop = () => {};
const noChange = p => p;
const emptyString = '';

const extendObject = (target, extObj) => (
    target = target === null || target === undefined ? {} : target,
    extObj = extObj === null || extObj === undefined ? {} : extObj,
    Object.setPrototypeOf(extObj, target),
    extObj
);

const getTargetSymbol = Symbol('proxyObject-getTarget');
function proxyObject(target, extObj, proxiedIfNotExist = false) {
    target = target === null || target === undefined ? {} : target;

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
        let $proxy = typeof(extObj) == 'function' ? extObj(target) : extObj;
        $proxy = $proxy === null || $proxy === undefined ? {} : $proxy;
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

    return new Proxy(
        {
            [getTargetSymbol]: getTarget,
        },
        {
            get,
            set,
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
    emptyString,
    extendObject,
    proxyObject,
    proxyClass,
};