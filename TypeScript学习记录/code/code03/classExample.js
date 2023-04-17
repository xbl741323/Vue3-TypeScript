"use strict";
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    sayHello() {
        console.log(`我叫${this.name}，今年${this.age}岁`);
    }
}
let one = new Person('we', 23);
one.sayHello();
