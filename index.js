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

const getSymbol = Symbol('proxyObject-get');
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

    function get(_target, prop) {
        if (prop == '__proto__') return target;
        let $proxy = typeof(extObj) == 'function' ? extObj(target) : extObj;
        $proxy = $proxy === null || $proxy === undefined ? {} : $proxy;
        if ( (prop in $proxy) && (!proxiedIfNotExist || !(prop in target)) ) {
            return getValue($proxy, prop);
        }
        else if (prop === getSymbol) {
            return _target[getSymbol];
        }
        else if (getSymbol in target) {
            return target[getSymbol](target, prop);
        }
        return getValue(target, prop);
    }

    return new Proxy(
        {
            [getSymbol]: get,
        },
        {
            get,
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