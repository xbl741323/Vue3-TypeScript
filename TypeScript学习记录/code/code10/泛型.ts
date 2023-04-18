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