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

function proxyObject(target, proxy, proxiedIfNotExist = false) {
    target = target === null || target === undefined ? {} : target;
    return new Proxy(target, {
        get: function(target, prop) {
            if (prop == '__proto__') return target;
            let $proxy = typeof(proxy) == 'function' ? proxy(target) : proxy;
            $proxy = $proxy === null || $proxy === undefined ? {} : $proxy;
            if ( (prop in $proxy) && (!proxiedIfNotExist || !(prop in target)) ) {
                return Reflect.get($proxy, prop, $proxy);
            }
            return Reflect.get(target, prop, target);
        }
    });
}

function proxyClass(Target, proxy, proxiedIfNotExist = false) {
    return new Proxy(Target, {
        construct(Target, args) {
            const target = new Target(...args);
            return proxyObject(target, proxy, proxiedIfNotExist);
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