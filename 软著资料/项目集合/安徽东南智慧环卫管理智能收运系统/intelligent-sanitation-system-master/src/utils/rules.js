import { isPositiveFloatNumber } from './validate'

export const validatePositiveFloatNumber = (rule, value, callback) => {
  if (isPositiveFloatNumber(value)) {
    callback()
  } else {
    return callback(new Error('请输入正数！'))
  }
}
