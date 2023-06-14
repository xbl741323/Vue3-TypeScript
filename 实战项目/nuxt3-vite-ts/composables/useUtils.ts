/*
  用于存放公共可复用函数，使用示例：const { sayHello } = useUtils();
*/
export const useUtils = () => {
  const sayHello = () => {
    console.log("hello from useUtils")
  }
  return {
    sayHello
  }
}