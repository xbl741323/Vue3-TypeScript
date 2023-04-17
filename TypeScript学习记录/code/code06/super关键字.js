"use strict";
class Game {
    constructor(name) {
        this.name = name;
    }
    introduce() {
        console.log("我是一款游戏！");
    }
}
class ShootingGame extends Game {
    // 如果在子类中写了构造函数，在子类构造函数中必须对父类的构造函数进行调用
    constructor(name, age) {
        super(name); // 调用父类的构造函数
        this.age = age;
    }
    introduce() {
        // 在类的方法中super就表示当前类的父类
        super.introduce();
    }
}
const shoot = new ShootingGame('csgo', 12);
console.log(shoot);
shoot.introduce();
