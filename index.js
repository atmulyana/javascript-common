/**
 * https://github.com/atmulyana/javascript-common
 */
'use strict';

export const noop = () => {};
export const noChange = p => p;
export const emptyString = '';

export const extendObject = (target, proxy) => (Object.setPrototypeOf(proxy, target), proxy);

export function proxyObject(target, proxy) {
    return new Proxy(target, {
        get: function(target, prop, receiver) {
            const proxy = typeof(proxy) == 'function' ? proxy(target) : proxy;
            if (proxy && proxy[prop] !== undefined) {
                let value = proxy[prop];
                if (typeof(value) == 'function') value = value.bind(proxy);
                return value;
            }
            return Reflect.get(target, prop, receiver);
        }
    });
}

export function proxyClass(Target, proxy) {
    return new Proxy(Target, {
        construct(Target, args) {
            const target = new Target(...args);
            return proxyObject(target, proxy);
        }
    });
}