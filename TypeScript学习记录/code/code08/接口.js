"use strict";
/**
 * - 1、接口用来定义一个类结构，用来定义一个类中应该包含哪些属性和方法
 * - 2、同时接口也可以当成类型声明去使用
 */
const obj = {
    name: "甘雨",
    age: 18,
    gender: "女"
};
/**
 * 定义类时，可以使类去实现一个接口，实现接口就是使类满足接口的要求
 */
class MyClass {
    constructor(name) {
        this.name = name;
    }
    sayHello() {
        console.log("大家好！");
    }
}
