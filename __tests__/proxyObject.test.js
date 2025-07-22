/**
 * https://github.com/atmulyana/javascript-common
 */
const {proxyObject} = require('../');

class A {
    varname = 'a';
    #a = 1;
    get a() {
        return this.#a;
    }
    set a(value) {
        this.#a = value;
    }
    getClassName() {
        return this.constructor.name;
    }
    getClassNameA() {
        return this.getClassName();
    }
}

class B {
    varname = 'b';
    #b = 2;
    get b() {
        return this.#b;
    }
    set b(value) {
        this.#b = value;
    }
    getClassName() {
        return this.constructor.name;
    }
    getClassNameB() {
        return this.getClassName();
    }
}

class C {
    varname = 'c';
    #c = 3;
    get c() {
        return this.#c;
    }
    set c(value) {
        this.#c = value;
    }
    getClassName() {
        return this.constructor.name;
    }
    getClassNameC() {
        return this.getClassName();
    }
}

class D {
    varname = 'd';
    #d = 4;
    get d() {
        return this.#d;
    }
    set d(value) {
        this.#d = value;
    }
    getClassName() {
        return this.constructor.name;
    }
    getClassNameD() {
        return this.getClassName();
    }
}

test("`proxyObject` on four object layers", () => {
    const a = new A(), b = new B(), c = new C(), d = new D(),
        proxy = proxyObject(
            proxyObject(
                proxyObject(
                    a,
                    b
                ),
                c
            ),
            d
        );
    
    expect(proxy.a).toBe(1);
    expect(proxy.b).toBe(2);
    expect(proxy.c).toBe(3);
    expect(proxy.d).toBe(4);

    expect(proxy.varname).toBe('d');
    expect(proxy.x).toBeUndefined();

    expect(proxy.getClassName()).toBe('D');
    expect(proxy.getClassNameA()).toBe('A');
    expect(proxy.getClassNameB()).toBe('B');
    expect(proxy.getClassNameC()).toBe('C');
    expect(proxy.getClassNameD()).toBe('D');

    proxy.a = 11;
    expect(proxy.a).toBe(11);
    expect(a.a).toBe(11);
    expect(b.a).toBeUndefined();
    expect(c.a).toBeUndefined();
    expect(d.a).toBeUndefined();

    proxy.b = 12;
    expect(proxy.b).toBe(12);
    expect(a.b).toBeUndefined();
    expect(b.b).toBe(12);
    expect(c.b).toBeUndefined();
    expect(d.b).toBeUndefined();

    proxy.c = 13;
    expect(proxy.c).toBe(13);
    expect(a.c).toBeUndefined();
    expect(b.c).toBeUndefined();
    expect(c.c).toBe(13);
    expect(d.c).toBeUndefined();

    proxy.d = 14;
    expect(proxy.d).toBe(14);
    expect(a.d).toBeUndefined();
    expect(b.d).toBeUndefined();
    expect(c.d).toBeUndefined();
    expect(d.d).toBe(14);

    proxy.varname = 'proxy';
    expect(proxy.varname).toBe('proxy');
    expect(a.varname).toBe('a');
    expect(b.varname).toBe('b');
    expect(c.varname).toBe('c');
    expect(d.varname).toBe('proxy');

    proxy.x = 15;
    expect(proxy.x).toBe(15);
    expect(a.x).toBe(15);
    expect(b.x).toBeUndefined();
    expect(c.x).toBeUndefined();
    expect(d.x).toBeUndefined();
});

test("`proxyObject` (with `proxiedIfNotExist` is `true`) on four object layers", () => {
    const a = new A(), b = new B(), c = new C(), d = new D(),
        proxy = proxyObject(
            proxyObject(
                proxyObject(
                    a,
                    b,
                    true
                ),
                c,
                true
            ),
            d,
            true
        );
    
    expect(proxy.a).toBe(1);
    expect(proxy.b).toBe(2);
    expect(proxy.c).toBe(3);
    expect(proxy.d).toBe(4);

    expect(proxy.varname).toBe('a');
    expect(proxy.x).toBeUndefined();

    expect(proxy.getClassName()).toBe('A');
    expect(proxy.getClassNameA()).toBe('A');
    expect(proxy.getClassNameB()).toBe('B');
    expect(proxy.getClassNameC()).toBe('C');
    expect(proxy.getClassNameD()).toBe('D');

    proxy.a = 11;
    expect(proxy.a).toBe(11);
    expect(a.a).toBe(11);
    expect(b.a).toBeUndefined();
    expect(c.a).toBeUndefined();
    expect(d.a).toBeUndefined();

    proxy.b = 12;
    expect(proxy.b).toBe(12);
    expect(a.b).toBeUndefined();
    expect(b.b).toBe(12);
    expect(c.b).toBeUndefined();
    expect(d.b).toBeUndefined();

    proxy.c = 13;
    expect(proxy.c).toBe(13);
    expect(a.c).toBeUndefined();
    expect(b.c).toBeUndefined();
    expect(c.c).toBe(13);
    expect(d.c).toBeUndefined();

    proxy.d = 14;
    expect(proxy.d).toBe(14);
    expect(a.d).toBeUndefined();
    expect(b.d).toBeUndefined();
    expect(c.d).toBeUndefined();
    expect(d.d).toBe(14);

    proxy.varname = 'proxy';
    expect(proxy.varname).toBe('proxy');
    expect(a.varname).toBe('proxy');
    expect(b.varname).toBe('b');
    expect(c.varname).toBe('c');
    expect(d.varname).toBe('d');

    proxy.x = 15;
    expect(proxy.x).toBe(15);
    expect(a.x).toBe(15);
    expect(b.x).toBeUndefined();
    expect(c.x).toBeUndefined();
    expect(d.x).toBeUndefined();
});