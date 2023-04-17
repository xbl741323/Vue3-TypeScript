(function () {
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

  const shoot = new ShootingGame('csgo', 12)
  console.log(shoot);
  shoot.introduce()
})()