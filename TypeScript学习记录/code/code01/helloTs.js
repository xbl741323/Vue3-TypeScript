"use strict";
console.log('hello ts');
let num = 12;
let msg = '你好';
// 如果变量的声明和赋值是同时进行的，TS可以自动对变量进行类型检测
let flag = true;
console.log(num, msg, flag);
// 函数参数和返回值规范数据类型
function sum(a, b) {
    return a + b;
}
let result = sum(num, num);
console.log(result);
