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

/**
 * To check a variable is a plain object that is an object that is created by using "object literal" (`{prop1: val1, prop2: val2, ...}`)
 * @param o Any variable to check
 */
export function isPlainObject(o: any): boolean | null;

/**
 * To compare two plain objects (see `isPlainObject` function) recursively whether they are equal or not. It's not to check
 * the object reference equality. Two plain objects are considered equal if they have exactly the same properties (the same
 * property names and values). If a property value is a plain object then it will also be compared by the same way. If the
 * compared property values are array then `arrayEquals` function will be invoked to check the equality.
 * @param o1 First object to compare
 * @param o2 Second object to compare
 * @param opts This parameter is optional and to determine how both objects are compared. This parameter is an object whose
 *      the following properties (all ones are optional):
 *      - `equals` is a function to examine the equality of two values. By default it's `Object.is`. The function signature
 *        is the same as the signature of `Object.is`. This function is invoked first before it's decided whether or not to
 *        recurse the comparison process (if two compared properties are also the plain object). If this function returns
 *        `true`, it will stop the recursive process. If it returns `false` then the recursive process will be done if two
 *        compared values are the plain object.
 *      - `allProps` is a boolean to determine whether non enumerable properties are checked or not. By default, it's `true`
 *        (non enumerable properties also checked). To get all property names including non-enumerable properties, we use
 *        `Object.getOwnPropertyNames` and if it excludes non-enumerable ones then we use `Object.keys`.
 *      - `arrayCheck` If it's `true` (default) then if a property is an array, `arrayEquals` function is invoked to compare
 *        its value. If it's `false` then the function referenced by `equals` is used.
 *      - `arrayLike` and `iterable` affect how `arrayEquals` function works. Please see the explanation of `arrayEquals`
 *        function.
 * @returns It returns `true` if `o1` and `o2` are equal. Otherwise, it returns `false`.
 */
export function objEquals(
    o1: any,
    o2: any,
    opts?: ObjEqualsOpts
): boolean;
type ObjEqualsOpts = {
    equals?: (val1: any, val2: any) => boolean,
    allProps?: boolean,
    arrayCheck?: boolean,
    arrayLike?: boolean,
    iterable?: boolean,
};

/**
 * To compare two arrays (or array-like) recursively whether they are equal or not. It's not to check the array reference
 * equality. Two arrays are considered equal if each item in one array is equal to the item at the same index in another
 * another array. To examine the equality of two compared items, it will invoke `objEquals` function. If both items are
 * array, they will also be compared by the same way.
 * @param ar1 First array to compare
 * @param ar2 Second array to compare
 * @param opts This parameter is optional and will be passed to `objEquals` function as third paraameter with `arrayCheck`
 *      is always `true` (to make recursive comparison). The `opts` property that really matters for this function are:
 *      - `arrayLike`, by default, it's `false`. If it's `true` then a value which is array-like will be considered as array.
 *        The array-like value is a value that can be used in the following statements:
 *        ```
 *          for (let i = 0; i < arrayLike.length; i++) {
 *              console.log(arrayLike[i]);
 *          }
 *        ```
 *        We must be careful to use `arrayLike` option because it can result an unexpected outcome. To check a value is an
 *        array-like or not, `arrayEquals.isArray` function is used. You may redefine this function to make sure what you
 *        really want. Currently, this function only does a simple logic:
 *        ```
 *          (ar) => typeof(ar?.length) == 'number' && ar.length >= 0
 *        ```
 *      - `iterable` is how to treat an iterable value. There are some value types which are iterable such as `Map`, `Set`
 *        and `string`. These values can be considered as an array of items. By default, `iterable` option is `false`. If
 *        it's `true` then the iterable value will be compared item by item.
 *        NOTE: `iterable` is evaluated before `arrayLike`.
 * @returns It returns `true` if array `ar1` and `ar2` are equal and returns `false` if not equal. If both or one of `ar1` or
 * `ar2` is not an array then it returns `null` 
 */
export function arrayEquals(
    ar1: any,
    ar2: any,
    opts?: Omit<ObjEqualsOpts, 'arrayCheck'>
): boolean | null;

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