"use strict";
(function () {
    /**
     * 修饰符：
     * 1、public:公有类型     在类里面、子类、类外面都可以访问
     * 2、protected:保护类型  在类里面、子类里面可以访问，在类外部没法访问
     * 3、private:私有类型
     * 在类里面可以访问，子类、类外部都没法访问，可以通过在类中添加方法
     * 使得私有属性可以被外部访问
     *
     */
    class Person {
        constructor(name, age) {
            this.name = name;
            this.age = age;
        }
        sayHello() {
            console.log("你好！");
        }
        /**
         * getter方法用来读取属性
         * setter方法用来设置属性
         * - 它们被称为属性的存取器
         */
        // 定义方法，用来获取age属性
        getAge() {
            return this.age;
        }
        // 定义方法，用来设置age属性，只能通过此方法来修改年龄，提高安全性
        setAge(value) {
            // 判断年龄是否合法
            if (value >= 0) {
                this.age = value;
            }
        }
        // TS中设置getter的方式
        get _name() {
            return this.name;
        }
        // TS中设置setter的方式
        set _name(value) {
            this.name = value;
        }
    }
    const per = new Person("甘雨", 18);
    /**
     * 现在属性是在对象中设置的，属性可以任意的被修改，这会
     * 导致对象中的数据变得非常不安全
     *
     */
    // per.age = -18
    per.setAge(-20);
    per._name = "胡桃";
    console.log(per);
    class A {
        constructor(name) {
            this.name = name;
        }
    }
    class B extends A {
        test() {
            console.log(this.name);
        }
    }
    const b = new B("小b");
    b.test();
    // class C {
    //   name: string;
    //   constructor(name: string) {
    //     this.name = name
    //   }
    //   test() {
    //     console.log(this.name);
    //   }
    // }
    class C {
        // 可以直接将属性定义在构造函数中
        constructor(name) {
            this.name = name;
        }
        test() {
            console.log(this.name);
        }
    }
    const c = new C("小c");
    c.test();
})();
