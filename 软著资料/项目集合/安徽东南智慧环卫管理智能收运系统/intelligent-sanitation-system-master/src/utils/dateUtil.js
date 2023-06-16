
/* eslint-disable eqeqeq */
const DateUtil = {
  // 日期格式部分
  yyyy_MM_dd_HH_mm_ss: 'yyyy-MM-dd HH:mm:ss',
  yyyy_MM_dd: 'yyyy-MM-dd',
  yyyy_MM_dd_1: 'yyyy/MM/dd',
  yyyyMMdd: 'yyyyMMdd',
  HH_mm_ss: 'HH:mm:ss',
  yyyy_MM: 'yyyy-MM',
  MM: 'MM',
  dd: 'dd',

  init: function () {},
  /**
   * 判断数据是否为空
   * @param data
   * @returns {boolean}
   */
  isNull: function (data) {
    if (data == null || data == undefined || data == '') {
      return true
    } else {
      return false
    }
  },
  /**
   * 判断是否为日期
   * @param date 不支持yyyyMMdd格式
   * @returns {boolean}
   */
  isDate: function (date) {
    if (isNaN(date) && !isNaN(Date.parse(date))) {
      return true
    } else {
      return false
    }
  },
  /**
   * 获取当前日期
   * @returns {Date}
   */
  getNowDate: function () {
    return new Date()
  },
  /**
   * 获取当前时间戳
   * @returns {number}
   */
  getNowTimeStamp: function () {
    return parseInt(Math.ceil(new Date().getTime()))
  },
  /**
   * Date日期格式化
   * @param date
   * @param pattern 可为空，默认yyyy-MM-dd HH:mm:ss
   * @returns {string}
   */
  format: function (date, pattern) {
    let yy = date.getFullYear() // 年
    let mm = date.getMonth() + 1 // 月
    let dd = date.getDate() // 日
    let hh = date.getHours() // 时
    let ii = date.getMinutes() // 分
    let ss = date.getSeconds() // 秒

    let clock = yy + '-'
    if (mm < 10) clock += '0'
    clock += mm + '-'
    if (dd < 10) clock += '0'
    clock += dd + ' '
    if (hh < 10) clock += '0'
    clock += hh + ':'
    if (ii < 10) clock += '0'
    clock += ii + ':'
    if (ss < 10) clock += '0'
    clock += ss
    if (DateUtil.isNull(pattern) || pattern == DateUtil.yyyy_MM_dd_HH_mm_ss) {
      return clock
    } else if (pattern == DateUtil.yyyy_MM_dd) {
      return clock.substring(0, 10)
    } else if (pattern == DateUtil.yyyy_MM) {
      return clock.substring(0, 7)
    } else if (pattern == DateUtil.HH_mm_ss) {
      return clock.substring(11)
    } else if (pattern == DateUtil.yyyy_MM_dd_1) {
      return clock.substring(0, 10).replace(/-/g, '/')
    } else if (pattern == DateUtil.yyyyMMdd) {
      return clock.substring(0, 10).replace(/-/g, '')
    } else if (pattern == DateUtil.MM) {
      return mm
    } else if (pattern == DateUtil.dd) {
      return dd
    } else {
      return clock
    }
  },
  /**
   * 日期字符串转时间戳
   * @param date  不支持yyyyMMdd格式
   * @returns {number}
   */
  strDate2TimeStamp: function (date) {
    date = date.replace(/-/g, '/')
    return new Date(date).getTime()
  },
  /**
   * 时间戳转日期字符串(yyyy-MM-dd HH:mm:ss)
   * @param timeStamp
   * @returns {string}
   */
  timeStamp2strDate: function (timeStamp) {
    let d = new Date(timeStamp) // 根据时间戳生成的时间对象
    let date =
      d.getFullYear() +
      '-' +
      (d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1) +
      '-' +
      (d.getDate() < 10 ? '0' + d.getDate() : d.getDate()) +
      ' ' +
      (d.getHours() < 10 ? '0' + d.getHours() : d.getHours()) +
      ':' +
      (d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()) +
      ':' +
      (d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds())
    return date
  },
  /**
   * 获取几天前日期(1代表明天，-1 代表前一天，-2前两天...)
   * @param date 指定日期
   * @param num
   * @param separator 连接符 如果为-,则结果为:yyyy-MM-dd
   */
  getDay: function (date, num, separator) {
    let today = new Date(date)
    let nowTime = today.getTime()
    let ms = 24 * 3600 * 1000 * num
    today.setTime(parseInt(nowTime + ms))
    let oYear = today.getFullYear()
    let oMoth = (today.getMonth() + 1).toString()
    if (oMoth.length <= 1) oMoth = '0' + oMoth
    let oDay = today.getDate().toString()
    if (oDay.length <= 1) oDay = '0' + oDay
    return oYear + separator + oMoth + separator + oDay
  },
  /**
   * 获取前几月(1代表下月，-1 代表上月，-2上两月...)
   * @param date 指定日期
   * @param num
   * @param separator 连接符 如果为-,则结果为:yyyy-MM
   */
  getMonth: function (date, num, separator) {
    let today = new Date(date)
    today.setMonth(today.getMonth() + num)
    let oYear = today.getFullYear()
    let oMoth = (today.getMonth() + 1).toString()
    if (oMoth.length <= 1) oMoth = '0' + oMoth
    return oYear + separator + oMoth
  },
  /**
   * 判断某一年是否是闰年
   * @param year
   * @returns {boolean}
   */
  isLeapYear: function (year) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  },
  /**
   * 获取某年某个月的天数(西方月份)
   * @param year
   * @param month 从0开始
   */
  getDaysOfMonthEN: function (year, month) {
    return [
      31,
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ][month]
  },
  /**
   * 获取某年某个月的天数(中国月份)
   * @param year
   * @param month 从1开始
   */
  getDaysOfMonthCN: function (year, month) {
    return [
      '中国没有0月',
      31,
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ][month]
  },
  /**
   * 计算一个日期是当年的第几天
   * @param date 字符串日期
   * @returns {number}
   */
  dayOfTheYear: function (date) {
    let obj = new Date(date)
    let year = obj.getFullYear()
    let month = obj.getMonth() // 从0开始
    let days = obj.getDate()
    let daysArr = [
      31,
      this.isLeapYear(year) ? 29 : 28,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ]
    for (var i = 0; i < month; i++) {
      days += daysArr[i]
    }
    return days
  },
  /**
   * 比较两个时间大小(不支持yyyyMMdd格式)
   *    date1>date2 return 1
   *    date1<date2 return -1
   *    date1==date2 return 0
   * @returns {number}
   */
  compareTime: function (date1, date2) {
    if (
      Date.parse(date1.replace(/-/g, '/')) >
      Date.parse(date2.replace(/-/g, '/'))
    ) {
      return 1
    } else if (
      Date.parse(date1.replace(/-/g, '/')) <
      Date.parse(date2.replace(/-/g, '/'))
    ) {
      return -1
    } else if (
      Date.parse(date1.replace(/-/g, '/')) ==
      Date.parse(date2.replace(/-/g, '/'))
    ) {
      return 0
    }
  },
  /**
   * 获取本周开始日期
   * @returns {*|string}
   */
  getWeekStartDay: function () {
    let now = new Date()
    return this.getDay(now, 1 - (now.getDay() ? now.getDay() : 7), '-')
  },
  /**
   * 获取本周结束日期
   * @returns {*|string}
   */
  getWeekEndDay: function () {
    let now = new Date()
    return this.getDay(now, 7 - (now.getDay() ? now.getDay() : 7), '-')
  },
  /**
   * 获取上周开始日期
   * @returns {*|string}
   */
  getUpWeekStartDay: function () {
    let now = new Date()
    let weekStartDay = this.getWeekStartDay(now)
    let date = new Date(weekStartDay)
    return this.getDay(date, -7, '-')
  },
  /**
   * 获取上周结束日期
   * @returns {*|string}
   */
  getUpWeekEndDay: function () {
    let now = new Date()
    let weekStartDay = this.getWeekStartDay(now)
    let date = new Date(weekStartDay)
    return this.getDay(date, -1, '-')
  },
  /**
   * 获取本月开始日期
   * @returns {*|string}
   */
  getMonthStartDay: function () {
    let now = new Date()
    let date = new Date(now.getFullYear(), now.getMonth(), 1)
    return this.format(date, DateUtil.yyyy_MM_dd)
  },
  /**
   * 获取本月结束日期
   * @returns {*|string}
   */
  getMonthEndDay: function () {
    let now = new Date()
    let date = new Date(
      now.getFullYear(),
      now.getMonth(),
      this.getDaysOfMonthEN(now.getFullYear(), now.getMonth())
    )
    return this.format(date, DateUtil.yyyy_MM_dd)
  },
  /**
   * 获取上月开始日期
   * @returns {*|string}
   */
  getUpMonthStartDay: function () {
    let now = new Date()
    now.setMonth(now.getMonth() - 1)
    let date = new Date(now.getFullYear(), now.getMonth(), 1)
    return DateUtil.format(date, DateUtil.yyyy_MM_dd)
  },
  /**
   * 获取上月结束日期
   * @returns {*|string}
   */
  getUpMonthEndDay: function () {
    let now = new Date()
    now.setMonth(now.getMonth() - 1)
    let lastMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    let date = new Date(
      lastMonth.getFullYear(),
      lastMonth.getMonth(),
      this.getDaysOfMonthEN(lastMonth.getFullYear(), lastMonth.getMonth())
    )
    return DateUtil.format(date, DateUtil.yyyy_MM_dd)
  },
  /**
   * 查询指定时间范围内的日期列表
   */
  getDateList4StartAndEnd: function (startDate, endDate) {
    let array = []
    while (startDate <= endDate) {
      array.push(startDate)
      startDate = this.getDay(startDate, 1, '-')
    }
    return array
  },
  /**
   * 获取当前日期的起始时间
   */
  getTodayStartTime: function () {
    return this.format(this.getNowDate(), 'yyyy-MM-dd') + ' 00:00:00'
  },
  /**
   * 获取当前日期的结束时间
   */
  getTodayEndTime: function () {
    return this.format(this.getNowDate(), 'yyyy-MM-dd') + ' 23:59:59'
  },
  /**
   * 获取当日日期
   */
  getToday: function () {
    return this.format(this.getNowDate(), 'yyyy-MM-dd')
  },
  getDiffForDate (startDay, endDay) {
    return Math.abs(
      parseInt(
        (new Date(endDay).getTime() - new Date(startDay).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    )
  },
  /**
   * 获取两个时间月份差
   */
  getDiffMonths (startDate, endDate) {
    if (!startDate || !endDate) {
      return ''
    }
    if (this.getMonth(startDate, 0, '-') == this.getMonth(endDate, 0, '-')) {
      return 1
    }
    if (this.getMonth(startDate, 0, '-') > this.getMonth(endDate, 0, '-')) {
      return ''
    }
    let result = 0
    while (this.getMonth(startDate, 0, '-') <= this.getMonth(endDate, 0, '-')) {
      result++
      startDate = this.getMonth(startDate, 1, '-')
    }
    return result
  },
  addMonths (date, months) {
    if (date) {
      var t = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      )
      t.setMonth(date.getMonth() + months)
      if (t.getDate() != date.getDate()) {
        t.setDate(0)
      }
      return t
    }
  },
  // 判断时间段是否重复
  isDateIntersection (start1, end1, start2, end2) {
    var startdate1 = new Date(start1.replace('-', '/').replace('-', '/'))
    var enddate1 = new Date(end1.replace('-', '/').replace('-', '/'))

    var startdate2 = new Date(start2.replace('-', '/').replace('-', '/'))
    var enddate2 = new Date(end2.replace('-', '/').replace('-', '/'))

    if (startdate1 >= startdate2 && startdate1 <= enddate2) {
      return true
    }

    if (enddate1 >= startdate2 && enddate1 <= enddate2) {
      return true
    }

    if (startdate1 <= startdate2 && enddate1 >= enddate2) {
      return true
    }
    return false
  },
  // 判断时间是否超过当前时间
  compareDatesize (date) {
    date += '-28 00:00'
    var date1 = new Date(Date.parse(date.replace(/-/g, '/')))
    var nowDate = new Date()
    nowDate.getFullYear() // 获取完整的年份(4位)
    nowDate.getMonth() // 获取当前月份(0-11,0代表1月)
    var date2 = ''
    if (nowDate.getMonth() + 1 < 10) {
      date2 = nowDate.getFullYear() +
        '-0' +
        (nowDate.getMonth() + 1) +
        '-' +
        nowDate.getDate() +
        ' 00:00'
    } else {
      date2 = nowDate.getFullYear() +
        '-' +
        (nowDate.getMonth() + 1) +
        '-' +
        nowDate.getDate() +
        ' 00:00'
    }
    date2 = new Date(Date.parse(date2.replace(/-/g, '/')))
    if (date1.getTime() < date2.getTime()) {
      return true
    } else {
      return false
    }
  },
  /**
   * 获取本周开始日期
   * @returns {*|string}
   */
  getWeekStart: function (date) {
    let now = date
    if (date == null || !date) {
      now = new Date()
    }
    return this.getDay(now, 1 - (now.getDay() ? now.getDay() : 7), '-')
  },
  /**
     * 获取本周结束日期
     * @returns {*|string}
     */
  getWeekEnd: function (date) {
    let now = date
    if (date == null || !date) {
      now = new Date()
    }
    return this.getDay(now, 7 - (now.getDay() ? now.getDay() : 7), '-')
  },
  /**
   * 获取本月开始日期
   * @returns {*|string}
   */
  getMonthStart: function (date) {
    let now = date
    if (date == null || !date) {
      now = new Date()
    }
    let monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return this.format(monthStart, DateUtil.yyyy_MM_dd)
  },
  /**
     * 获取本月结束日期
     * @returns {*|string}
     */
  getMonthEnd: function (date) {
    let now = date
    if (date == null || !date) {
      now = new Date()
    }
    let monthEnd = new Date(
      now.getFullYear(),
      now.getMonth(),
      this.getDaysOfMonthEN(now.getFullYear(), now.getMonth())
    )
    return this.format(monthEnd, DateUtil.yyyy_MM_dd)
  },
  getTime: function (time) {
    // 转换为时分秒
    var timeStr = ''
    let h = parseInt(time / 60 / 60 % 24)
    h = h < 10 ? '0' + h : h
    let m = parseInt(time / 60 % 60)
    m = m < 10 ? '0' + m : m
    let s = parseInt(time % 60)
    s = s < 10 ? '0' + s : s
    // 作为返回值返回
    return h + ':' + m + ':' + s
  }

}

export default DateUtil
