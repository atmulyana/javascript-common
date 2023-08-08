/**
 * https://github.com/atmulyana/javascript-common
 */
'use strict';

const noop = () => {};
const noChange = p => p;
const emptyString = '';

const extendObject = (target, proxy) => (
    target = target === null || target === undefined ? {} : target,
    proxy = proxy === null || proxy === undefined ? {} : proxy,
    Object.setPrototypeOf(proxy, target),
    proxy
);

function proxyObject(target, proxy) {
    target = target === null || target === undefined ? {} : target;
    return new Proxy(target, {
        get: function(target, prop, receiver) {
            if (prop == '__proto__') return target;
            let $proxy = typeof(proxy) == 'function' ? proxy(target) : proxy;
            $proxy = $proxy === null || $proxy === undefined ? {} : $proxy;
            if ($proxy[prop] !== undefined) {
                let value = $proxy[prop];
                if (typeof(value) == 'function') value = value.bind($proxy);
                return value;
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}

function proxyClass(Target, proxy) {
    return new Proxy(Target, {
        construct(Target, args) {
            const target = new Target(...args);
            return proxyObject(target, proxy);
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