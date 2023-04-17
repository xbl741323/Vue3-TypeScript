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

const cat = new Cat('小喵', 2);
cat.sayHello()
cat.meow()