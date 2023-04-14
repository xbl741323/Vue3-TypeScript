// 也可以直接使用字面量进行类型声明
let a: 10;
a = 10;

// any 表示任意类型，一个变量设置类型为any后相当于对该变量关闭了TS的类型检测
// 使用TS时，不建议使用any类型
// let d: any;
// 声明变量如果不指定类型，则TS解析器会自动判断变量的类型为any（隐式的any）
let d;
d = 10;
d = true;
d = "hello";

// unknown表示未知类型的值
let e: unknown;
e = 18;
e = true;
e = "hello";

// d的类型是any，他可以赋值给任意变量
let s: string;
s = d;

// unknown 实际上就是一个类型安全的any
// unknown 类型的变量，不能直接赋值给其他变量
// s = e;
// 加类型判断后，可以赋值
if (typeof e === 'string') {
  s = e;
}

// 加类型断言，可以赋值
// 类型断言，可以用来告诉解析器变量的实际类型   
/**
 * 语法（有两种）：
 * 1、变量 as 类型
 * 2、<类型>变量
 */
s = e as string;
s = <string>e;

// void 用来表示空，以函数为例，就表示没有返回值的函数（但是可以返回null和undefined）
function fn(): void {
  return;
}

// never 表示永远不会有返回结果（也不能返回null和undefined）
function fnTwo(): never {
  throw new Error('报错了！')
}

// object表示一个js对象
let f: object;  // 一般不这么用，因为object范围太广了
f = {};
f = function () { }

// {} 用来指定对象中可以包含哪些属性
// 语法：{属性名：属性值，属性名：属性值}
let g: { name: string }
g = { name: '王小美' }
// g = { name: '王小美', age: 12 } 不能这么写，必须和定义时结构保持一致

// 在属性名后面加?，表示属性是可选的，赋值时可传可不传
let h: { name: string, age?: number }
h = { name: '王小美' }

// [propName: string]: any 表示任意类型的属性
let o: { name: string, [propName: string]: any };
o = { name: '王小美', age: 18, gender: '女' }

/**
 * 设置函数结构的类型声明
 * 语法：(形参：类型，形参：类型 ...) => 返回值
 */
let x: (a: number, b: number) => number;
x = function (x1: number, x2: number): number {
  return x1 + x2
}

/**
 * 数组的类型声明：
 *  1、类型[]
 *  2、Array<类型>
 */
// string[] 表示字符串数组； number[] 表示数值数组； any[] 表示任意值数组
let v1: string[];
v1 = ['a', 'b', 'c']
let v2: number[];
v2 = [1, 2, 3]
let v3: any[];
v3 = [1, 'a', true, null]

// 数组也可以这样定义
let n1: Array<number>;
n1 = [1, 2, 3, 4]

/**
 * 元祖，就是固定长度的数组
 * 语法：[类型，类型，类型]
 */
let v: [string, number];
v = ['a', 1]

/**
 * enum 枚举
 * 好处：清晰易懂
 */
enum Gender {
  Male = 0,
  Female = 1
}

let i: { name: string, gender: Gender };
i = {
  name: '王小美',
  gender: Gender.Male
}

// &表示同时 
let j: { name: string } & { age: number }
j = {
  name: '王小美',
  age: 18
}

// 可以使用|来连接多个类型（联合类型）
let b: "male" | "female"
b = "male";
b = "female";
let c: boolean | string
c = true;
c = 'hello';

// 类型的别名 可以简化类型的使用
type myType = string
let q: myType;
q = 'a';

type numType = 1 | 2 | 3 | 4 | 5
let r: numType;
let m: numType;
r = 1;
m = 1;