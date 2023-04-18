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

#### 1、类（class）
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
+ 介绍
```
/**
 * 直接定义的属性，需要通过对象的实例去访问：
 * const per = new Person();
 * per.name
 * 
 * readonly开头的属性表示一个只读的属性，无法修改
 * 
 * 使用static开头的属性是静态属性（类属性），可以通过类去访问：
 * Person.gender
 * 
 */
class Person {
  // 定义实例属性
  name: string = "甘雨";
  readonly age: number = 12;
  // 使用static关键字可以定义类属性（静态属性）
  static gender: string = "女";

  sayHello() {
    console.log("你好！")
  }

  /**
  * 定义方法：
  * 如果方法以static开头则方法就是类方法，可以直接通过类去调用
  */
  static run() {
    console.log('开始跑了！')
  }
}

const one = new Person() // 实例化
one.sayHello()
one.name = '胡桃'
Person.run()
```

#### 2、构造函数和this
```
class Dog {
  name: string;
  age: number;
  /**
   * constructor 被称为构造函数
   * 构造函数会在对象创建时调用
   */
  constructor(name: string, age: number) {
    // 在实例方法中，this就表示当前的实例
    this.name = name;
    this.age = age;
  }
  bark() {
    // 在方法中可以通过this来表示当前调用的对象
    console.log(`${this.age}岁的${this.name}在汪汪汪！`);
  }
}
```

#### 3、类的继承
```
class Animal {
  name: string;
  age: number;
  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
  sayHello() {
    console.log(`${this.age}岁的${this.name}在叫！`);
  }
}

/**
 * Cat extends Animal
 * - 此时，Animal被称为父类，Cat被称为子类
 * - 使用继承后，子类将会拥有父类所有的方法和属性
 * - 通过继承可以将多个类中共有的代买写在一个父类中，这样
 *   只需要写一次即可让所有的子类同时拥有父类中的属性和方法
 * - 如果子类中添加了和父类相同名字的方法，则子类中的方法会覆盖
 *   父类中的方法,这种子类覆盖掉父类中方法的形式，我们称之为方法的重写
 */
class Cat extends Animal {
  constructor(name: string, age: number) {
    // super初始化父类的构造函数
    super(name, age)
  }
  meow() {
    console.log(`${this.age}岁的${this.name}在喵喵喵！`);
  }
}
```

#### 4、super关键字
```
class Game {
  name: string;
  constructor(name: string) {
    this.name = name
  }

  introduce() {
    console.log("我是一款游戏！");

  }
}

class ShootingGame extends Game {
  age: number;
  // 如果在子类中写了构造函数，在子类构造函数中必须对父类的构造函数进行调用
  constructor(name: string, age: number) {
    super(name) // 调用父类的构造函数
    this.age = age
  }
  introduce() {
    // 在类的方法中super就表示当前类的父类
    super.introduce()
  }
}
```

#### 5、抽象类
```
/**
   * - 以abstract开头的类是抽象类，抽象类和其他类区别不大，只是不能用来创建对象
   * - 抽象类就是专门用来被继承的类
   * - 抽象类中可以添加抽象方法，抽像类中的抽象方法不包含具体的实现并且必须在子类中实现
   */
  abstract class Game {
    name: string;
    constructor(name: string) {
      this.name = name
    }

    abstract introduce(): void;
  }

  class ShootingGame extends Game {
    age: number;
    // 如果在子类中写了构造函数，在子类构造函数中必须对父类的构造函数进行调用
    constructor(name: string, age: number) {
      super(name) // 调用父类的构造函数
      this.age = age
    }
    introduce() {
      console.log("实现了父类的抽象方法！")
    }
  }
```

#### 6、接口
```
/**
 * - 1、接口用来定义一个类结构，用来定义一个类中应该包含哪些属性和方法
 * - 2、同时接口也可以当成类型声明去使用
 */

interface myInterface {
  name: string;
  age: number;
}

interface myInterface {
  gender: string;
}

const obj: myInterface = {
  name: "甘雨",
  age: 18,
  gender: "女"
}

/**
 * - 接口可以在定义类的时候去限制类的结构
 * - 接口中所有的属性都不能有实际的值
 * - 接口只定义对象的结构，而不考虑实际值
 * - 在接口中所有的方法都是抽象方法
 */
interface myInter {
  name: string;
  sayHello(): void;
}

/**
 * 定义类时，可以使类去实现一个接口，实现接口就是使类满足接口的要求
 */
class MyClass implements myInter {
  name: string;
  constructor(name: string) {
    this.name = name
  }
  sayHello(): void {
    console.log("大家好！");
  }
}
```

#### 7、属性的封装
```
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
    private name: string;
    private age: number;
    constructor(name: string, age: number) {
      this.name = name
      this.age = age
    }
    sayHello() {
      console.log("你好！")
    }
    /**
     * getter方法用来读取属性
     * setter方法用来设置属性
     * - 它们被称为属性的存取器
     */

    // 定义方法，用来获取age属性
    getAge() {
      return this.age
    }

    // 定义方法，用来设置age属性，只能通过此方法来修改年龄，提高安全性
    setAge(value: number) {
      // 判断年龄是否合法
      if (value >= 0) {
        this.age = value
      }
    }

    // TS中设置getter的方式
    get _name() {
      return this.name
    }

    // TS中设置setter的方式
    set _name(value: string) {
      this.name = value
    }
  }
  const per = new Person("甘雨", 18)
  /**
   * 现在属性是在对象中设置的，属性可以任意的被修改，这会
   * 导致对象中的数据变得非常不安全
   * 
   */
  // per.age = -18
  per.setAge(-20)
  per._name = "胡桃"
  console.log(per)

  class A {
    protected name: string;
    constructor(name: string) {
      this.name = name
    }
  }

  class B extends A {
    test() {
      console.log(this.name);
    }
  }

  const b = new B("小b")
  b.test()

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
    constructor(public name: string) { }
    test() {
      console.log(this.name);
    }
  }

  const c = new C("小c")
  c.test()
```

#### 8、泛型
```
// 一般不建议用any
// function fun(a: any): any {
//   return a
// }

/**
 * 在定义函数或是类时，如果遇到类型不明确时就可以使用泛型
 */

function fun<T>(a: T): T {
  return a
}
// 可以直接调用具有泛型的函数
// 不指定泛型，TS可以自动对类型进行推断
let r1 = fun(1)
// 指定泛型
let r2 = fun<string>("a")

// 传多个参数时
function fun2<T, K>(a: T, b: K): T {
  return a
}
let r3 = fun2(123, "a")
let r4 = fun2<string, number>("a", 12)

interface Inter {
  length: number
}

// T extends Inter 表示泛型T必须是Inter的实现类（子类）
function fun3<T extends Inter>(a: T): number {
  return a.length
}

fun3("1234");
// fun3(1234); // 数字没有length属性

class PersonalClass<T>{
  name: T;
  constructor(name: T) {
    this.name = name
  }
}

const pc = new PersonalClass<string>("甘雨")
```
