# TypeScript 学习记录

## 一、TypeScript介绍

+ 1、TypeScript是由微软开发的一款开源的编程语言
+ 2、TypeScript是Javascript的超级，遵循最新的ES6、ES5规范。TypeScript扩展了JavaScript的语法，并添加了类型。
+ 3、TypeScript更像后端java、c#这样的面向对象语言，所以可以让TypeScript开发大型企业项目。
+ 4、可以在任何支持JavaScript的平台中执行
+ 5、最新的Vue、React也可以集成TypeScript。
+ 6、TypeScript不能被JS解析器直接执行，需要先转换成JS。

## 二、TypeScript开发环境搭建

+ 1、下载安装Node.js
+ 2、使用npm全局安装TypeScript `npm i -g typescript`
+ 3、创建一个ts文件
+ 4、使用tsc对ts文件进行编译

```
进入命令行
进入项目根目录执行命令：tsc --init 生成tsconfig.json文件（解决函数实现重复问题）
进入ts文件所在目录
执行命令：tsc xxx.ts
```

## 三、TypeScript基本语法

### 一、基本类型

1、类型声明

+ 类型声明是TS非常重要的特点
+ 通过类型声明可以指定TS中变量（参数、形参）的类型
+ 指定类型后，当为变量赋值时，TS编译器会自动检查是否符合类型声明，符合则赋值，否则报错
+ 简而言之，类型声明给变量设置了类型，使得变量只能存储某种类型的值
+ 语法：

```
let 变量：类型；
let 变量：类型 = 值
function fn(参数：类型，参数：类型)：类型{
  ...
}
```

2、自动类型判断

+ TS拥有自动的类型判断机制
+ 当对变量的声明和赋值是同时进行的，TS编译器会自动判断变量的类型，此时可以省略掉类型声明，但后续赋值只能赋同类型的值，否则会报错

```
let a = 1
a = 2   // 正确
a = '2' // 错误
```

3、类型介绍

+ 数字类型（number）

```
任意数字
```

+ 字符串类型（string）

```
任意字符串
```

+ 布尔类型（boolean）

```
布尔值true或false
```

+ 任意类型（any）

```
任意类型
```

+ 未知类型（unknown）

```
 类型安全的any
```

+ void类型

```
 没有值但可以返回（null或undefined）
```

+ never类型

```
 不能是任何值（也不可以返回null或undefined）
```

+ 对象类型（object）

```
任意js对象
```

+ 数组类型（array）

```
任意js数组
```

+ 元组类型（tuple）

```
TS新增类型，固定长度的数组 [4,5]
```

+ 枚举类型（enum）

```
TS中新增类型 
enum Gender {
  Male = 0,
  Female = 1
}
```

### 二、面向对象
面向对象是一种重要的编程思想，基于这种编程思想，程序中所有的事物都被认为是一种对象，对象包含两部分数据和功能，以人为例，人就是一个对象，人的姓名、年龄、性别等属于数据，而人可以吃饭、睡觉、说话这些就属于人的功能，数据在对象中被称为属性，而功能被称为方法。

1、类（class）
要想面向对象，首先要拥有对象，TS中通过类（class）来创建对象。
+ 定义类
```
class 类名 {
  属性名：类型；

  constructor(参数：类型){
    this.属性名 = 参数
  }

  方法名(){
    ...
  }
}
```
+ 示例：
```
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  sayHello() {
    console.log(`我叫${this.name}，今年${this.age}岁`)
  }
}
```
2、构造函数和this
3、类的继承
4、super关键字
5、抽象类