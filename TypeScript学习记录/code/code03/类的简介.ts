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

const one = new Person()
one.sayHello()
one.name = '胡桃'
Person.run()
console.log(Person.gender)
console.log(one)