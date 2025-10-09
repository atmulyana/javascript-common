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
 * This is a read-only empty array ([]). Read-only means we cannot add/remove an entry to/from it. It's useful
 * for a initial value of a "state" variable whose array type. In "React" framework, it can be used as the
 * parameter of `React.useState` hook function. If there are many array "state" variable, it's better to keep one
 * copy in memory. It's safe to share among some "state" variables because an array "state" variable is considered
 * to change if it's assigned to a different instance of array. So, we may not just call `push` method and
 * re-assign it.
 */
export var emptyArray: any[];

/**
 * This is a read-only empty plain object ({}). Read-only means we cannot set/unset a property to/from it. It's
 * useful for a initial value of a "state" variable whose type of a plain object. In "React" framework, it can be
 * used as the parameter of `React.useState` hook function. If there are many object "state" variable, it's better
 * to keep one copy in memory. It's safe to share among some "state" variables because an object "state" variable
 * is considered to change if it's assigned to a different instance of object. So, we may not just set/unset
 * a property and re-assign it.
 */
export var emptyObject: {};

/**
 * This is an empty string (""). An empty string is often used as the default value of a string variable.
 * Instead of maintaining many copies, it's better to keep one copy in memory.
 */
export var emptyString: string;

type Extend<T, P> = Omit<T, keyof P> & P;
type CombineObject<T extends object | null | undefined, P extends object | null | undefined> =
    T extends NonNullable<T> ? (P extends NonNullable<P> ? Extend<T, P> : T)
                             : (P extends NonNullable<P> ? P : {});

/**
 * It extends the object `target` by adding to it the new members (properties/methods) from the object `extObj`.
 * It's like `Object.assign(target, extObj)`, but different from `Object.assign`, when there are some the same
 * members among `target` and `extObj`, it doesn't remove those members from `target` and replace them with
 * the same ones from `extObj`. The original members still exist in `target`. This function is simply invoke
 * `Object.setPrototypeOf(extObj, target)`. If it's so simple, why do we need the wrapper function? It's because
 * we need a static type checking. The type of the returned value should be the type which is combination between
 * `target`'s type and `extObj`'s type.
 * @param target The extended object
 * @param extObj The object which has the extending members
 * @returns Different from `Object.assign`, it returns the reference of `extObj`, not `target`
 */
export function extendObject<T extends object | null | undefined, P extends object | null | undefined>(
    target: T,
    extObj: P
): CombineObject<T, P>;

/**
 * Similar to `extendObject` but it doesn't change the prototype of `target`. It utilizes a `Proxy` object. It's
 * useful if `target` already has a prototype object.
 * @param target The extended object
 * @param extObj The object which has the extending members. It may be also a function with format `target => extObj`.
 * @param proxiedIfNotExist If `true` then a member is read from `extObj` only if the member doesn't exist on `target`. By default, it's `false`.
 * @returns A `Proxy` object
 */
export function proxyObject<
    T extends object | null | undefined,
    P extends object | null | undefined,
    NE extends (boolean | undefined) = false
>(
    target: T,
    extObj: P | ((target: T) => P),
    proxiedIfNotExist?: NE
): NE extends true ? CombineObject<P, T> : CombineObject<T, P>;

/**
 * Similar to `proxyObject` but the first parameter is not an instance object, it's a class of target object.
 * This function will create the target instance: `const target = new Target(...args)` and then call `proxyObject`  
 * @param Target The class of the extended object
 * @param extObj The object which has the extending members. It may be also a function with format `target => extObj`.
 * @param proxiedIfNotExist Needed by `proxyObject`
 * @returns A `Proxy` object of the class.
 */
export function proxyClass<
    Class extends (abstract new (...args: any) => any),
    P extends object | null | undefined,
    NE extends (boolean | undefined) = false
>(
    Target: Class,
    extObj: P | ((target: InstanceType<Class>) => P),
    proxiedIfNotExist?: NE
): NE extends true ? CombineObject<P, InstanceType<Class>> : CombineObject<InstanceType<Class>, P>;