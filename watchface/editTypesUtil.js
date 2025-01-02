import { createWidget, widget, align, show_level, data_type, event, edit_type } from '@zos/ui'
import { launchApp, SYSTEM_APP_SUN_AND_MOON, SYSTEM_APP_PAI, SYSTEM_APP_HR, SYSTEM_APP_BATTERY, SYSTEM_APP_SLEEP, SYSTEM_APP_SPO2, SYSTEM_APP_STATUS, SYSTEM_APP_PRESSURE, SYSTEM_APP_WEATHER, SYSTEM_APP_ALTIMETER, SYSTEM_APP_SPORT_STATUS, SYSTEM_APP_SPORT_HISTORY, SPORTLIST, APPLIST, SYSTEM_APP_STOP_WATCH, SYSTEM_APP_ALARM, SYSTEM_APP_COUNTDOWN, SYSTEM_APP_MENSTRUAL } from '@zos/router'
import { log } from '@zos/utils'

const logger = log.getLogger('textwatch-italiano')

const previewPath = 'preview/';
const numPath = 'numbers_28/';//numbers_28
const iconBg = 'iconbg/';
const XicPath = 'xicon/';
const heartPath = 'heart/';
const UVIPath =  'UVI/';
const weatherPath = 'weather/';
const moonPath =  'moon/';

const numArray = [
    numPath + '0.png',
    numPath + '1.png',
    numPath + '2.png',
    numPath + '3.png',
    numPath + '4.png',
    numPath + '5.png',
    numPath + '6.png',
    numPath + '7.png',
    numPath + '8.png',
    numPath + '9.png',
  ];

  const weatherArray = [
    weatherPath + '0.png',
    weatherPath + '1.png',
    weatherPath + '2.png',
    weatherPath + '3.png',
    weatherPath + '4.png',
    weatherPath + '5.png',
    weatherPath + '6.png',
    weatherPath + '7.png',
    weatherPath + '8.png',
    weatherPath + '9.png',
    weatherPath + '10.png',
    weatherPath + '11.png',
    weatherPath + '12.png',
    weatherPath + '13.png',
    weatherPath + '14.png',
    weatherPath + '15.png',
    weatherPath + '16.png',
    weatherPath + '17.png',
    weatherPath + '18.png',
    weatherPath + '19.png',
    weatherPath + '20.png',
    weatherPath + '21.png',
    weatherPath + '22.png',
    weatherPath + '23.png',
    weatherPath + '24.png',
    weatherPath + '25.png',
    weatherPath + '26.png',
    weatherPath + '27.png',
    weatherPath + '28.png',
  ];

  const moonArray = [
    moonPath + '1.png',
    moonPath + '2.png',
    moonPath + '3.png',
    moonPath + '4.png',
    moonPath + '5.png',
    moonPath + '6.png',
    moonPath + '7.png',
    moonPath + '8.png',
    moonPath + '9.png',
    moonPath + '10.png',
    moonPath + '11.png',
    moonPath + '12.png',
    moonPath + '13.png',
    moonPath + '14.png',
    moonPath + '15.png',
    moonPath + '16.png',
    moonPath + '17.png',
    moonPath + '18.png',
    moonPath + '19.png',
    moonPath + '20.png',
    moonPath + '21.png',
    moonPath + '22.png',
    moonPath + '23.png',
    moonPath + '24.png',
    moonPath + '25.png',
    moonPath + '26.png',
    moonPath + '27.png',
    moonPath + '28.png',
    moonPath + '29.png',
  ];

  const heartArray = [
    heartPath + '1.png',
    heartPath + '2.png',
    heartPath + '3.png',
    heartPath + '4.png',
    heartPath + '5.png',
    heartPath + '6.png',
  ];

  const uviArray = [
    UVIPath + '1.png',
    UVIPath + '2.png',
    UVIPath + '3.png',
    UVIPath + '4.png',
    UVIPath + '5.png',
  ];
/*
ui.edit_type.STEP=10000
ui.edit_type.BATTERY=11001
ui.edit_type.HEART=10001
ui.edit_type.CAL=10006
ui.edit_type.DISTANCE=10009
ui.edit_type.AQI=10405
ui.edit_type.HUMIDITY=10406
ui.edit_type.UVI=10407
ui.edit_type.DATE=11002
ui.edit_type.WEEK=11003
ui.edit_type.WEATHER=10401
ui.edit_type.TEMPERATURE=10400
ui.edit_type.SUN=10408
ui.edit_type.STAND=10007
ui.edit_type.SUN_RISE=10600
ui.edit_type.SUN_SET=10601
ui.edit_type.WIND=10409
ui.edit_type.SPO2=10002
ui.edit_type.STRESS=10003
ui.edit_type.FAT_BURN=10008
ui.edit_type.FLOOR=10010
ui.edit_type.ALTIMETER=10411
ui.edit_type.BODY_TEMP=10011
ui.edit_type.MOON=10602
ui.edit_type.PAI_DAILY=10015
ui.edit_type.PAI=10015
ui.edit_type.PAI_WEEKLY=10012
ui.edit_type.APP_PAI=10013
ui.edit_type.SMS=10800
ui.edit_type.TIME=11000
ui.edit_type.WEATHER_CURRENT=10402
ui.edit_type.WEATHER_HIGH=10403
ui.edit_type.WEATHER_LOW=10404
ui.edit_type.WIND_DIRECTION=10410
ui.edit_type.COUNT_DOWN=10801
ui.edit_type.STOP_WATCH=10802
ui.edit_type.SLEEP=10004
ui.edit_type.ALARM_CLOCK=10803
ui.edit_type.MENSYRUAL=10005
ui.edit_type.TRAINING_LOAD=10200
ui.edit_type.VO2MAX=10201
ui.edit_type.RECOVERY_TIME=10202
ui.edit_type.ALTITUDE=10603
ui.edit_type.FATIGUE=10014
ui.edit_type.RUNNING_TIME=11004
ui.edit_type.RUNNING_DISTANCE=11005
ui.edit_type.RUNNING_CAL=11006
ui.edit_type.RUNNING_AVERAGE_PACE=11007
ui.edit_type.RUNNING_AVERAGE_HEARTRATE=11008
ui.edit_type.RUNNING_AVERAGE_CADENCE=11009
ui.edit_type.RUNNING_AVERAGE_STRIDE=11010
ui.edit_type.MONTH_RUN_TIMES=11011
ui.edit_type.MONTH_RUN_DISTANCE=11012
ui.edit_type.INVALID=11013
*/
  export const  widgetOptionalArray = [
    // {
    //   type: edit_type.APPLIST,
    //   //preview: previewPath + 'step.png',
    // },
    // {
    //   type: edit_type.SPORTLIST,
    //   preview: previewPath + 'step.png',
    // },
    // {
    //   type: edit_type.RECOVERY_TIME,
    //   preview: previewPath + 'step.png',
    // },
    // {
    //   type: edit_type.TRAINING_LOAD,
    //   preview: previewPath + 'step.png',
    // },
    // {
    //   type: edit_type.MONTH_RUN_DISTANCE,
    //   preview: previewPath + 'step.png',
    // },
    // {
    //   type:edit_type.VO2MAX,
    //   preview: previewPath + 'step.png',
    // },
    // {
    //   type:edit_type.STOP_WATCH,
    //   preview: previewPath + 'step.png',
    // },
    {
      type:edit_type.ALARM_CLOCK,
      preview: previewPath + 'step.png',
    },
    {
      type:edit_type.COUNT_DOWN,
      preview: previewPath + 'step.png',
    },
    {
      type: edit_type.STEP,
      preview: previewPath + 'step.png',
    },
    {
      type: edit_type.CAL,
      preview: previewPath + 'kcal.png',
    },
    {
      type: edit_type.BATTERY,
      preview: previewPath + 'bat.png',
    },
    {
      type: edit_type.HEART,
      preview: previewPath + 'heart.png',
    },
    {
      type: edit_type.UVI,
      preview: previewPath + 'UVI.png',
    },
    {
      type: edit_type.PAI,
      preview: previewPath + 'Pai.png',
    },
    {
      type: edit_type.DISTANCE,
      preview: previewPath + 'dis.png',
    },
    {
      type: edit_type.STAND,
      preview: previewPath + 'stand.png',
    },
    {
      type: edit_type.SPO2,
      preview: previewPath + 'spo2.png',
    },
    {
      type: edit_type.STRESS,
      preview: previewPath + 'pressure.png',
    },
    {
      type: edit_type.SLEEP,
      preview: previewPath + 'sleep.png',
    },
    {
      type: edit_type.WIND,
      preview: previewPath + 'wind.png',
    },
    {
      type: edit_type.WEATHER,
      preview: previewPath + 'weather.png',
    },
    {
      type: edit_type.TEMPERATURE,
      preview: previewPath + 'T.png',
    },
    {
      type: edit_type.FAT_BURN,
      preview: previewPath + 'sport.png',
    },
    {
      type: edit_type.ALTIMETER,
      preview: previewPath + 'Kpa.png',
    },
    {
      type: edit_type.MOON,
      preview: previewPath + 'moon.png',
    },
  ];

export default class EditTypesUtil {

   static drawWidget(editType, id) {
    let config = {
      bgx: null,
      bgy: null,
      w: null,
      iconX: null,
      iconY: null,
      numX: null,
      numY: null,
      numH: null,
      bgImg: null,
      array: null,
      type: null,
      src: null,
      numArray: null,
      h: 0,
      invalid: null,
      align: null,
      unitEn: null,
      unitSc: null,
      unitTc: null,
      spPath: null,
      negative: null,
      color: null,
      id: null,
      appId: null,
      appParams: null
    }
    switch (id) {
      case 110:
        config.bgx = px(42 + 4)//84*84
        config.bgy = px(290 + 4)//284
        config.bgw = px(92)
        config.numX = px(42)
        config.numY = px(290 + 32)
        config.numH = px(20)
        config.iconX = px(42 + 30)
        config.iconY = px(290 + 56)
        break
      case 111:
        config.bgx = px(194 + 4)
        config.bgy = px(290 + 4)
        config.bgw = px(92)
        config.numX = px(194)
        config.numY = px(290 + 32)
        config.numH = px(20)
        config.iconX = px(194 + 30)
        config.iconY = px(290 + 56)
        break
      case 112:
        config.bgx = px(346 + 4)
        config.bgy = px(290 + 4)
        config.bgw = px(92)
        config.numX = px(346)
        config.numY = px(290 + 32)
        config.numH = px(20)
        config.iconX = px(346 + 30)
        config.iconY = px(290 + 56)
        break
      default:
        return
    }

    switch (editType) {
      case edit_type.STEP:
        config.id = 103
        config.iconPath = XicPath + 'step.png'
        config.dataType = data_type.STEP
        config.numArray = numArray
        config.bgImg = iconBg + 'step.png'
        config.color = 0x06a5ff
        config.appId = SYSTEM_APP_STATUS
        break
      case edit_type.CAL:
        config.id = 103
        config.iconPath = XicPath + 'kcal.png'
        config.dataType = data_type.CAL
        config.numArray = numArray
        config.bgImg = iconBg + 'cal.png'
        config.color = 0xdf4f26
        config.appId = SYSTEM_APP_STATUS
        break
      case edit_type.PAI:
        config.id = 103
        config.iconPath = XicPath + 'Pai.png'
        config.dataType = data_type.PAI_WEEKLY
        config.numArray = numArray
        config.bgImg = iconBg + 'pai.png'
        config.color = 0xd612c0
        config.appId = SYSTEM_APP_PAI
        break
      case edit_type.DISTANCE:
        config.id = 104
        config.iconPath = XicPath + 'dis.png'
        config.dataType = data_type.DISTANCE
        config.numArray = numArray
        config.spPath = numPath + 'point.png'
        config.invalid = numPath +'none.png'
        config.bgImg = iconBg + 'dis.png'
        config.appId = SYSTEM_APP_STATUS
        break
      case edit_type.HEART:
        config.id = 102
        config.array = heartArray
        config.iconPath = XicPath + 'heart.png'
        config.dataType = data_type.HEART
        config.numArray = numArray
        config.invalid = numPath +'none.png'
        config.appId = SYSTEM_APP_HR
        break
      case edit_type.BATTERY:
        config.id = 103
        config.iconPath = XicPath + 'bat.png'
        config.dataType = data_type.BATTERY
        config.numArray = numArray
        config.bgImg = iconBg + 'bat.png'
        config.color = 0x06c18a
        config.appId = SYSTEM_APP_BATTERY
        break
      case edit_type.SLEEP:
        config.id = 104
        config.iconPath = XicPath + 'sleep.png'
        config.dataType = data_type.SLEEP
        config.numArray = numArray
        config.spPath = numPath + 'point.png'
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'sleep.png'
        config.appId = SYSTEM_APP_SLEEP
        break
      case edit_type.SPO2:
        config.id = 105
        config.iconPath = XicPath + 'spo2.png'
        config.dataType = data_type.SPO2
        config.numArray = numArray
        config.unitEn = numPath + 'percent.png'
        config.unitSc = numPath + 'percent.png'
        config.unitTc = numPath + 'percent.png'
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'spo2.png'
        config.appId = SYSTEM_APP_SPO2
        break
      case edit_type.STAND:
        config.id = 103
        config.iconPath = XicPath + 'stand.png'
        config.dataType = data_type.STAND
        config.numArray = numArray
        config.spPath = numPath + 'slash.png'
        config.bgImg = iconBg + 'step.png'
        config.color = 0x06a5ff
        config.appId = SYSTEM_APP_STATUS
        break
      case edit_type.STRESS:
        config.id = 104
        config.iconPath = XicPath + 'pressure.png'
        config.dataType = data_type.STRESS
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'kpa.png'
        config.appId = SYSTEM_APP_PRESSURE
        break
      case edit_type.TEMPERATURE:
        config.id = 109
        config.iconPath = XicPath + 'T.png'
        config.dataType = data_type.WEATHER_CURRENT
        config.numArray = numArray
        config.unitEn = numPath +'degree.png'
        config.unitSc = numPath +'degree.png'
        config.unitTc = numPath +'degree.png'
        config.negative = numPath +'negative.ng'
        config.invalid = numPath +'none.png'
        config.bgImg = iconBg + 't.png'
        config.appId = SYSTEM_APP_WEATHER
        break
      case edit_type.UVI:
        config.id = 108
        config.array = uviArray
        config.flag = true
        config.iconPath = XicPath + 'UVI.png'
        config.dataType = data_type.UVI
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.appId = SYSTEM_APP_WEATHER
        break
      case edit_type.WEATHER:
        config.id = 107
        config.bgImg = iconBg + 'weather.png'
        config.dataType = data_type.WEATHER_CURRENT
        config.numArray = numArray
        config.invalid = numPath + 'wnone.png'
        config.negative = numPath + 'negative.png'
        config.unitEn = numPath + 'degree.png'
        config.unitSc = numPath + 'degree.png'
        config.unitTc = numPath + 'degree.png'
        config.appId = SYSTEM_APP_WEATHER
        break
      case edit_type.WIND:
        config.id = 105
        config.iconPath = XicPath + 'wind.png'
        config.dataType = data_type.WIND
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'wind.png'
        config.appId = SYSTEM_APP_WEATHER
        break
      case edit_type.FAT_BURN:
        config.id = 104
        config.iconPath = XicPath + 'sport.png'
        config.dataType = data_type.FAT_BURN
        config.numArray = numArray
        config.spPath = numPath + 'point.png'
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'sport.png'
        config.appId = SYSTEM_APP_STATUS
        break
      case edit_type.ALTIMETER:
        config.id = 104
        config.iconPath = XicPath + 'Kpa.png'
        config.dataType = data_type.ALTIMETER
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'kpa.png'
        config.appId = SYSTEM_APP_ALTIMETER
        break
      case edit_type.MOON:
        config.id = 106
        config.iconPath = createWidget(widget.IMG_LEVEL, {
          x: config.bgx,//156
          y: config.bgy,//275
          image_array: moonArray,//84*84
          image_length: moonArray.length,
          type: data_type.MOON,
          show_level: show_level.ONLY_NORMAL,
        })
        config.dataType = data_type.MOON
        config.numArray = numArray
        config.appId = SYSTEM_APP_SUN_AND_MOON
        break
      case edit_type.RECOVERY_TIME:
        config.id = 103
        config.iconPath = XicPath + 'recovery.png'
        config.dataType = data_type.RECOVERY_TIME
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'recovery.png'
        config.color = 0x06a5ff
        config.appId = SYSTEM_APP_SPORT_STATUS
        break
      case edit_type.TRAINING_LOAD:
        config.id = 104
        config.iconPath = XicPath + 'recovery.png'
        config.dataType = data_type.TRAINING_LOAD
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'recovery.png'
        config.color = 0x06a5ff
        config.appId = SYSTEM_APP_SPORT_STATUS
        break
      case edit_type.MONTH_RUN_DISTANCE:
          config.id = 104
          config.iconPath = XicPath + 'run.png'
          config.dataType = data_type.MONTH_RUN_DISTANCE
          config.numArray = numArray
          config.invalid = numPath + 'none.png'
          config.bgImg = iconBg + 'recovery.png'
          config.color = 0x06a5ff
          config.appId = SYSTEM_APP_SPORT_HISTORY
          break
      case edit_type.VO2MAX:
        config.id = 103
        config.iconPath = XicPath + 'vo2.png'
        config.dataType = data_type.VO2MAX//15-65
        config.numArray = numArray
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'vo2.png'
        config.color = 0x06a5ff
        config.appId = SYSTEM_APP_SPORT_STATUS
        config.appParams = {page: 1}//?
        break
      case edit_type.STOP_WATCH:
        config.id = 104
        config.iconPath = XicPath + 'stopwatch.png'
        config.dataType = data_type.STOP_WATCH
        config.numArray = numArray
        config.spPath = numPath + 'point.png'
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'dis.png'
        config.appId = SYSTEM_APP_STOP_WATCH
        break
      case edit_type.ALARM_CLOCK:
        config.id = 104
        config.iconPath = XicPath + 'alarm.png'
        config.dataType = data_type.ALARM_CLOCK
        config.numArray = numArray
        config.spPath = numPath + 'point.png'
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'dis.png'
        config.appId = SYSTEM_APP_ALARM
        break
      case edit_type.COUNT_DOWN:
        config.id = 104
        config.iconPath = XicPath + 'stopwatch.png'
        config.dataType = data_type.COUNT_DOWN
        config.numArray = numArray
        config.spPath = numPath + 'point.png'
        config.invalid = numPath + 'none.png'
        config.bgImg = iconBg + 'dis.png'
        config.appId = SYSTEM_APP_COUNTDOWN
        break

      default:
        return config
    }

    function iconText() {
      createWidget(widget.TEXT_IMG, {
        isCharacter: true,
        x: config.numX,// + 1,
        y: config.numY,
        w: config.bgw,
        h: config.numH,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: align.CENTER_H,
        show_level: show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        dot_image: config.spPath,
        negative_image: config.negative,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.IMG, {
        x: config.iconX,
        y: config.iconY,// + 2,
        src: config.iconPath,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });
    }

    function tIconText() {
      createWidget(widget.TEXT_IMG, {
        x: config.numX,// + 1,
        y: config.numY,
        w: config.bgw,
        h: config.numH,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: align.CENTER_H,
        show_level: show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        negative_image: config.negative,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.IMG, {
        x: config.iconX,
        y: config.iconY,// + 2,
        src: config.iconPath,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });
    }

    if (config.id == 102) {
      createWidget(widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        alpha: 255,
        src: heartPath + 'heart0.png',
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
          launchApp({ appId: config.appId, native: true, params: config.appParams })
        });

      createWidget(widget.IMG_LEVEL, {
        x: config.bgx,
        y: config.bgy,
        image_array: config.array,
        image_length: config.array.length,
        type: config.dataType,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      iconText()
    }

    if (config.id == 108) {
      createWidget(widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        alpha: 255,
        src: UVIPath + 'uvi0.png',
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });
      createWidget(widget.IMG_LEVEL, {
        x: config.bgx,
        y: config.bgy,
        image_array: config.array,
        image_length: config.array.length,
        type: config.dataType,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      iconText()
    }
    //BATTERY STAND PAI
    if (config.id == 103) {
      createWidget(widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.ARC_PROGRESS, {
        x: 0, y: 0,
        w: px(92), h: px(92),
        center_x: config.bgx + px(42),
        center_y: config.bgy + px(42),
        radius: 35,
        start_angle: -139,
        end_angle: 139,
        line_width: 8,
        color: config.color,
        type: config.dataType,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      iconText()
    }
    if (config.id == 104) {
      createWidget(widget.IMG, {//background
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.TEXT_IMG, {
        x: config.numX,
        y: config.numY - px(6),
        w: config.bgw,
        h: config.numH,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: align.CENTER_H,
        show_level: show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        dot_image: config.spPath,
        negative_image: config.negative,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.IMG, {
        x: config.iconX,
        y: config.iconY - px(5),
        src: config.iconPath,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });
    }

    if (config.id == 105 || config.id == 109) {
      createWidget(widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.IMG_POINTER, {
        src: numPath + 'p.png',
        center_x: config.numX + px(46),
        center_y: px(290 + 46),
        x: px(6),
        y: px(40),
        type: config.dataType,
        start_angle: -135,
        end_angle: 135,
        show_level: show_level.ONLY_NORMAL,
      })
      if (config.id == 109) {
        tIconText()
      } else {
        iconText()
      }
    }
    if (config.id == 106) {
      iconText()
    }
    if (config.id == 107) {
      createWidget(widget.IMG, {
        x: config.bgx,
        y: config.bgy,
        w: config.bgw,
        h: config.bgw,
        src: config.bgImg,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.TEXT_IMG, {
        x: config.numX,//150
        y: config.numY - px(6),//310
        w: config.bgw,
        h: config.numH,
        type: config.dataType,
        font_array: config.numArray,
        h_space: config.h,
        align_h: align.CENTER_H,
        show_level: show_level.ONLY_NORMAL,
        unit_sc: config.unitSc,
        unit_en: config.unitEn,
        unit_tc: config.unitTc,
        invalid_image: config.invalid,
        negative_image: config.negative,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });

      createWidget(widget.IMG, {
        x: config.iconX,
        y: config.iconY - px(5),
        src: createWidget(widget.IMG_LEVEL, {
          x: config.iconX,
          y: config.iconY - px(5),
          image_array: weatherArray,//32*32
          image_length: weatherArray.length,
          type: data_type.WEATHER,
          show_level: show_level.ONLY_NORMAL,
        }),
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, () => {
        launchApp({ appId: config.appId, native: true, params: config.appParams })
      });
    }
  }


}