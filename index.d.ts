/**
 * https://github.com/atmulyana/javascript-common
 */

/**
 * It's a function that does nothing (`() => {}`). This function is often used as the default value for
 * a variable whose function type. Instead of maintaining many copies, it's better to keep one copy in memory.
 */
export function noop(): any;

/**
 * This function returns the parameter that is passed into it, no change (`p => p`). Like `noop`, this function
 * is often used as the default value for a variable whose function type. Instead of maintaining many copies,
 * it's better to keep one copy in memory.
 * @param p any value.
 * @returns parameter `p`
 */
export function noChange<P>(p: P): P;

/**
 * This is an empty string (""). An empty string is often used as the default value of a string variable.
 * Instead of maintaining many copies, it's better to keep one copy in memory.
 */
export var emptyString: string;

type CombineObject<T extends object | null | undefined, P extends object | null | undefined> =
    T extends NonNullable<T> ? (P extends NonNullable<P> ? T & P : T)
                             : (P extends NonNullable<P> ? P : {});

/**
 * It extends the object `target` by adding to it the new members (properties/methods) from the object `proxy`.
 * It's like `Object.assign(target, proxy)`, but different from `Object.assign`, when there are some the same
 * members among `target` and `proxy`, it doesn't remove those members from `target` and replace them with
 * the same ones from `proxy`. The original members still exist in `target`. This function is simply invoke
 * `Object.setPrototypeOf(proxy, target)`. If it's so simple, why do we need the wrapper function? It's because
 * we need a static type checking. The type of the returned value should be the type which is combination between
 * `target`'s type and `proxy`'s type.
 * @param target The extended object
 * @param proxy The object which has the extending members
 * @returns Different from `Object.assign`, it returns the reference of `proxy`, not `target`
 */
export function extendObject<T extends object | null | undefined, P extends object | null | undefined>(
    target: T,
    proxy: P
): CombineObject<T, P>;

/**
 * Similar to `extendObject` but it doesn't change the prototype of `target`. It utilizes a `Proxy` object. It's
 * useful if `target` already has a prototype object.
 * @param target The extended object
 * @param proxy The object which has the extending members
 * @param proxiedIfNotExist If `true` then it's only proxied if the member doesn't exist on `target`. By default, it's `false`.
 * @returns A `Proxy` object
 */
export function proxyObject<T extends object | null | undefined, P extends object | null | undefined>(
    target: T,
    proxy: P | ((target: T) => P),
    proxiedIfNotExist?: boolean
): CombineObject<T, P>;

/**
 * Similar to `proxyObject` but the first parameter is not an instance object, it's a class of target object.
 * This function will create the target instance: `const target = new Target()`
 * @param Target The class of the extended object
 * @param proxy The object which has the extending members
 * @param proxiedIfNotExist Needed by `proxyObject`
 * @returns A `Proxy` object
 */
export function proxyClass<Class extends (abstract new (...args: any) => any), P extends object | null | undefined>(
    Target: Class,
    proxy: P | ((target: InstanceType<Class>) => P),
    proxiedIfNotExist?: boolean
): CombineObject<InstanceType<Class>, P>;