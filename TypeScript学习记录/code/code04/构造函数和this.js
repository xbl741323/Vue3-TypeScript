"use strict";
class Dog {
    /**
     * constructor 被称为构造函数
     * 构造函数会在对象创建时调用
     */
    constructor(name, age) {
        // 在实例方法中，this就表示当前的实例
        this.name = name;
        this.age = age;
    }
    bark() {
        // 在方法中可以通过this来表示当前调用的对象
        console.log(`${this.age}岁的${this.name}在汪汪汪！`);
    }
}
const dog = new Dog('大黄', 2);
const dog2 = new Dog('小白', 1);
dog.bark();
console.log(dog);
console.log(dog2);
