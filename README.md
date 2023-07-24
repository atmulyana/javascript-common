## **javascript-common**

The code in this package is common to be used in some my projects. Although for my projects, it may be useful for you.
Things that can be imported from this package:

#### `noop`
It's a function that does nothing (`() => {}`). This function is often used as the default value for
a variable whose function type. Instead of maintaining many copies, it's better to keep one copy in memory.

#### `noChange`
This function returns the parameter that is passed into it, no change (`p => p`). Like `noop`, this function
is often used as the default value for a variable whose function type. Instead of maintaining many copies,
it's better to keep one copy in memory.

#### `emptyString`
This is an empty string (""). An empty string is often used as the default value of a string variable.

#### `extendObject(target, proxy)`
It extends the object `target` by adding to it the new members (properties/methods) from the object `proxy`.
It's like `Object.assign(target, proxy)`, but different from `Object.assign`, when there are some the same
members among `target` and `proxy`, it doesn't remove those members from `target` and replace them with
the same ones from `proxy`. The original members still exist in `target`. This function is simply invoke
`Object.setPrototypeOf(proxy, target)`. If it's so simple, why do we need the wrapper function? It's because
we need a static type checking. The type of the returned value should be the type which is combination between
`target`'s type and `proxy`'s type.

    <T extends object, P extends object>(target: T, proxy: P) => T & P


#### `proxyObject(target, proxy)`
Similar to `extendObject` but it doesn't change the prototype of `target`. It utilizes a `Proxy` object. It's
useful if `target` already has a prototype object.

#### `proxyClass(Target, proxy)`
Similar to `proxyObject` but the first parameter is not an instance object, it's a class of target object.
This function will create the target instance: `const target = new Target()`