import { createWidget, widget, align, text_style, prop, anim_status, show_level, data_type, event } from '@zos/ui'
import { getScene, SCENE_AOD } from '@zos/app'
import { px, log } from '@zos/utils'
import { Time, Battery, HeartRate, Step } from '@zos/sensor'
import { launchApp, SYSTEM_APP_CALENDAR, SYSTEM_APP_STATUS, SYSTEM_APP_HR } from '@zos/router'
import NumberToText from './numberToText.js'
import { themes } from './themes.js'

try {
  (() => {

    /*
    *         column A           |            column B
    *                            |
    * HOUR    ##############     |     ############### +1
    *                            |
    *                            |
    * MIN     ##############     |     ############### +1
    *                            |
    *
    *                            |
    *
    *
    */

const DEBUG = false;
const logger = log.getLogger("textwatch-italiano");

const timeSensor = new Time()
const batterySensor = new Battery()
//const heartRate = new HeartRate()
const stepSensor = new Step()

//balance = 480*480
const HaX = px(-30)
const MaX = HaX

const HbX = px(540)
const MbX = HbX

//hours Y
const HaY = px(110)
const HbY = HaY
//minutes Y
const MaY = px(196)
const MbY = MaY

const HaH = px(80)// (font size * 1.25).
const HbH = HaH
const MaH = HaH
const MbH = HaH

const HaW = px(540)
const HbW = HaW
const MaW = HaW
const MbW = HaW

const dateX = px(0)
const dateY = px(400)
const dateH = px(32.5)// (font size * 1.25).
const dateW = px(480)

const healtLine2Y = px(316);

const dateTextSize = px(26);
const minuteTextSize = px(64);
const hourTextSize = px(64);

const animDuration = 1000;
const animFps = 25;

let currentIdTheme = '';

const aodBgColor = 0x000000;
let dateColor = '';
let hourColor = '';
let minuteColor = '';
let hourAODColor = '';
let minuteAODColor = '';
let healthColor = '';
let stepArcProgressColor = '';

const dummyCharset = 'acdegimnopqrstuvz';
const dummyCharsetDate = 'abcdefgilmnoprstuvzì0123456789';

const hourNormalFont = 'fonts/Barlow-Medium.ttf';
const minuteNormalFont = 'fonts/Barlow-Regular.ttf';
const dateFont = 'fonts/Barlow-RegularDate.ttf';

const hourAODFont = 'fonts/Barlow-Light.ttf';
const minuteAODFont = 'fonts/Barlow-Thin.ttf';

const anim_step_in = {
  anim_prop: prop.X,
  anim_from: HbX,
  anim_to: HaX,
  anim_rate: 'easeinout',
  anim_duration: animDuration,
}

const anim_step_out = {
  anim_prop: prop.X,
  anim_from: HaX,
  anim_to: px(-570),// - (W - start x)
  anim_rate: 'easeinout',
  anim_duration: animDuration
}

let secondTextWidget = null;

let dateTextWidget = null;
let hourTextWidgetA = null;
let hourTextWidgetB = null;
let minuteTextWidgetA = null;
let minuteTextWidgetB = null;

let hourAODWidget = null;
let minuteAODWidget = null;

let animIdHourA = null;
let animIdHourB = null;
let animIdMinuteA = null;
let animIdMinuteB = null;

let batteryIconWidget = null;
let batteryWidget = null;
let stepArcProgressWidget = null;

WatchFace({
  //https://github.com/zepp-health/zeppos-samples/blob/main/application/3.0/3.0-feature/app-service/time_service.js

  giova_build() {

    const aodBg = createWidget(widget.FILL_RECT, {
      x: px(0), y: px(0),
      w: px(480), h: px(480),
      color: aodBgColor, show_level: show_level.ONAL_AOD,
    })

    const editBg = createWidget(widget.WATCHFACE_EDIT_BG, {
      edit_id: 101,
      x: px(0), y: px(0),show_level: show_level.ONLY_NORMAL | show_level.ONLY_EDIT,
      bg_config: themes,
      count: themes.length,
      default_id: 0,
      fg: 'edit/mask.png',
      tips_x: px(178), tips_y: px(428),
      tips_bg: 'edit/tips.png'
    })

    currentIdTheme = editBg.getProperty(prop.CURRENT_TYPE);
    if ( DEBUG ) logger.log(currentIdTheme);

    hourColor = themes[currentIdTheme].values.hourColor;
    minuteColor = themes[currentIdTheme].values.minuteColor;
    hourAODColor = themes[currentIdTheme].values.hourAODColor;
    minuteAODColor = themes[currentIdTheme].values.minuteAODColor;
    healthColor = themes[currentIdTheme].values.healthColor;
    stepArcProgressColor = themes[currentIdTheme].values.stepArcProgressColor;
    dateColor = themes[currentIdTheme].values.dateColor;

    let screenType = getScene()

    if ( DEBUG ) {
      secondTextWidget = createWidget(widget.TEXT, {
        x: px(0),y: px(2),w: px(480), h: px(10), text_size: px(10),
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        color: 0xffffff,
        show_level: show_level.ONLY_NORMAL,
        text: String(timeSensor.getSeconds())
      })
    }

    /* DATE */
    // const dateGroup = createWidget(widget.GROUP,  {x: dateX, y: dateY, w: dateW, h: dateH })
    // const dataInGroup =  dateGroup.createWidget(widget.TEXT,{font: dateFont,text: 'mercoledì 29 settembre',x: 0, y: 0, w: dateW, h: dateH,
    // text_size: dateTextSize, color: 0xffffff, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS });
    // dateGroup.createWidget(widget.FILL_RECT,  {x: 0, y: 0, w: dateW, h: dateH, color: 0x000000 })

    dateTextWidget = createWidget(widget.TEXT,{font: dateFont,text: dummyCharsetDate,
      x: dateX, y: dateY, w: dateW, h: dateH,
      text_size: dateTextSize, color: dateColor, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS
    });

    updateDateWidget();
    // dateTextWidget.setProperty(prop.MORE, { font: dateFont,
    //   //text: 'mercoledì 29 settembre' // test long value
    //   //text: 'giovedì 30 aprile'//test height, g and  p
    //   text: `${NumberToText.getDayOfWeek(timeSensor.getDay())} ${timeSensor.getDate()} ${NumberToText.getMonth(timeSensor.getMonth()-1)}`
    // })

    dateTextWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_CALENDAR, native: true })
    })
    //dataInGroup.setAlpha(30);
    //dateTextWidget.setAlpha(0);

    /* HOURS */
    hourTextWidgetA = createWidget(widget.TEXT, { font: hourNormalFont, text: dummyCharset,
      x: HaX, y: HaY, w: HaW, h: HaH, text_size: hourTextSize, color: hourColor, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })
    hourTextWidgetB = createWidget(widget.TEXT, { font: hourNormalFont, text: dummyCharset,
      x: HbX, y: HbY, w: HbW, h: HbH, text_size: hourTextSize, color: hourColor, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })
    hourAODWidget = createWidget(widget.TEXT, { font: hourAODFont, text: dummyCharset,
      x: HaX, y: HaY, w: HaW, h: HaH, text_size: hourTextSize, color: hourAODColor, show_level: show_level.ONAL_AOD, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })

      hourAODWidget.setProperty(prop.MORE, { font: hourAODFont, text: `${NumberToText.getHours(timeSensor.getHours())}` });
      hourTextWidgetA.setProperty(prop.MORE, { font: hourNormalFont, text: `${NumberToText.getHours(timeSensor.getHours())}` })
      hourTextWidgetB.setProperty(prop.MORE, { font: hourNormalFont,  text: '' })

      animIdHourA = hourTextWidgetA.setProperty(prop.ANIM, {
        anim_steps: [anim_step_out],
        anim_fps: animFps,
        anim_auto_start: 0,
        anim_auto_destroy: 0,
        anim_repeat: 0,
        anim_complete_func: () => {
          if ( DEBUG ) logger.log('animation complete animIdHourA');
          hourTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}`, font: hourNormalFont, x: HaX });
        }
      })

      animIdHourB = hourTextWidgetB.setProperty(prop.ANIM, {
        anim_steps: [anim_step_in],
        anim_fps: animFps,
        anim_auto_start: 0,
        anim_auto_destroy: 0,
        anim_repeat: 0,
        anim_complete_func: () => {
          if ( DEBUG ) logger.log('animation complete animIdHourB');
          hourTextWidgetB.setProperty(prop.MORE, {text:'', x: HbX});
        }
      })

    /* MINUTES */
    minuteTextWidgetA = createWidget(widget.TEXT, {char_space: 0, padding: false, font: minuteNormalFont,
       text: dummyCharset, show_level: show_level.ONLY_NORMAL, x: MaX, y: MaY, w: MaW, h: MaH, color: minuteColor, text_size: minuteTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })
    minuteTextWidgetB = createWidget(widget.TEXT, { font: minuteNormalFont,
       text: dummyCharset, show_level: show_level.ONLY_NORMAL, x: MbX, y: MbY, w: MbW, h: MbH, color: minuteColor, text_size: minuteTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })
    minuteAODWidget = createWidget(widget.TEXT, { font: minuteAODFont,
       text: dummyCharset, show_level: show_level.ONAL_AOD, x: MaX, y: MaY, w: MaW, h: MaH, color: minuteAODColor, text_size: minuteTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS, })

      minuteAODWidget.setProperty(prop.MORE, { font: minuteAODFont, text: `${NumberToText.getMinutes(timeSensor.getMinutes())}` });
      minuteTextWidgetA.setProperty(prop.MORE, { font: minuteNormalFont, text: `${NumberToText.getMinutes(timeSensor.getMinutes())}` })
      minuteTextWidgetB.setProperty(prop.MORE, { font: minuteNormalFont, text: '' })

      animIdMinuteA = minuteTextWidgetA.setProperty(prop.ANIM, {
        anim_steps: [anim_step_out],
        anim_fps: animFps,
        anim_auto_start: 0,
        anim_auto_destroy: 0,
        anim_repeat: 0,
        anim_complete_func: () => {
          if ( DEBUG ) logger.log('animation complete animIdMinuteA');
          minuteTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}`, font: minuteNormalFont, x: MaX });
        }
      })

      animIdMinuteB = minuteTextWidgetB.setProperty(prop.ANIM, {
        anim_steps: [anim_step_in],
        anim_fps: animFps,
        anim_auto_start: 0,
        anim_auto_destroy: 0,
        anim_repeat: 0,
        anim_complete_func: () => {
          if ( DEBUG ) logger.log('animation complete animIdMinuteB');
          minuteTextWidgetB.setProperty(prop.MORE, {text: '', x: MbX });
        }
      })

    /* BATTERY */
    batteryIconWidget = createWidget(widget.IMG, {
      x: px(200), y: px(20), pos_y: px(2), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/battery.png'
    })
    batteryWidget = createWidget(widget.TEXT_FONT,{
      x: px(210), y: px(20), w: px(60), h: px(30), text_size: px(22), align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.BATTERY,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,
    })
    updateBatteryWidget();

    /* HEART */
    let heartIcon = createWidget(widget.IMG, {
      x: px(72), y: healtLine2Y + px(28), pos_y: px(-2), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/heart.png'
    })
    const heartWidget = createWidget(widget.TEXT_FONT,{
      x: px(58), y: healtLine2Y, w: px(60), h: px(30), text_size: px(22), align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.HEART,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,  //  0: hide the unit     1:show the unit with lower case    2: show the unit with upper case.
    })
    heartIcon.addEventListener(event.CLICK_DOWN, () => {
      launchApp({ appId: SYSTEM_APP_HR, native: true })
    })
    heartWidget.addEventListener(event.CLICK_DOWN, () => {
      launchApp({ appId: SYSTEM_APP_HR, native: true })
    })

    /* STEP */
    createWidget(widget.IMG, {
      x: px(224), y: healtLine2Y + px(28), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/step.png'
    })
    createWidget(widget.TEXT_FONT,{
      x: px(208), y: healtLine2Y, w: px(64), h: px(30), text_size: px(22), align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.STEP,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,  //  0: hide the unit     1:show the unit with lower case    2: show the unit with upper case.
    })
    stepArcProgressWidget = createWidget(widget.ARC_PROGRESS, { show_level: show_level.ONLY_NORMAL })
    stepArcProgressWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_STATUS, native: true })
    })
    updateStepWidget()

    /* DISTANCE */
    let distanceIcon = createWidget(widget.IMG, {
      x: px(376), y: healtLine2Y + px(28), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/dis.png'
    })
    distanceWidget = createWidget(widget.TEXT_FONT,{
      x: px(362), y: healtLine2Y, w: px(60), h: px(30), text_size: px(22), align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.DISTANCE,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,  //  0: hide the unit     1:show the unit with lower case    2: show the unit with upper case.
    })
    distanceIcon.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_STATUS, native: true })
    })
    distanceWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_STATUS, native: true })
    })


    // const dataArray = [
    //   { text: '0' },
    //   { text: '1' },
    //   { text: '2' },
    //   { text: '3' },
    //   { text: '4' }
    // ];

    // let cycleImageTextList = createWidget(widget.CYCLE_IMAGE_TEXT_LIST, {
    //   x: px(300),
    //   y: px(50),
    //   w: px(50),
    //   h: px(50),
    //   data_array: dataArray,
    //   data_size: 5,
    //   item_height: px(10),
    //   item_text_color: 0x000000,
    //   item_text_size: 8,
    //   //item_text_x: 0,
    //   //item_text_y: 0,
    //   item_image_x: px(0),
    //   //item_bg_color: 0xffffff
    // })

    // // Get the index at the top of the scrolling list
    // result = cycleImageTextList.getProperty(prop.MORE, {})
    // console.log(result.index)

    // // Set the index at the top of the scrolling list
    // cycleImageTextList.setProperty(prop.LIST_TOP, { index: 3 })



    const delegate = createWidget(widget.WIDGET_DELEGATE, {
      resume_call: function () {
        if ( DEBUG ) logger.log('resume_call');

        if (screenType == SCENE_AOD) {
          batterySensor.offChange(updateBatteryWidget());
          stepSensor.offChange(updateStepWidget());
          hourTextWidgetA.setProperty(prop.MORE, {text : '', x: HaX});
          minuteTextWidgetA.setProperty(prop.MORE, {text : '', x: MaX});
          hourTextWidgetB.setProperty(prop.MORE, {text : '', x: HbX});
          minuteTextWidgetB.setProperty(prop.MORE, {text : '', x: MbX});
          hourAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}`, font: hourAODFont });
          minuteAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}`, font: minuteAODFont });
        } else {
          if ( DEBUG ) { secondTextWidget.setProperty(prop.MORE, {text : timeSensor.getSeconds() }) }
          batterySensor.onChange(updateBatteryWidget());
          stepSensor.onChange(updateStepWidget());
          hourTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}`, font: hourNormalFont, x: HaX });
          minuteTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}`, font: minuteNormalFont, x: MaX });
          hourTextWidgetB.setProperty(prop.MORE, {text : '', x: HbX});
          minuteTextWidgetB.setProperty(prop.MORE, {text : '', x: MbX});
          hourAODWidget.setProperty(prop.MORE, {text : ''});
          minuteAODWidget.setProperty(prop.MORE, {text : ''});
          updateDateWidget();
        }
      },
      pause_call: function () {
        if ( DEBUG ) logger.log('ui pause');
        batterySensor.offChange(updateBatteryWidget());
        stepSensor.offChange(updateStepWidget());
      },
    })

    if ( DEBUG ) {
      setInterval(() => {
        secondTextWidget.setProperty(prop.MORE, {text : timeSensor.getSeconds() });
      }, 1000)
    }

    /* SENSOR EVENTS */
    timeSensor.onPerDay(() => {
      if ( DEBUG ) logger.log('onPerDay: ' + timeSensor.getDay + '-' + timeSensor.getMonth)
      updateDateWidget();
    })

    timeSensor.onPerMinute(() => {
      let hour = timeSensor.getHours()
      let min = timeSensor.getMinutes()
      if ( DEBUG ) logger.log('onPerMinute: ' + hour + ':' + min)

      if (screenType == SCENE_AOD) {
        hourAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getHours(hour)}`, font: hourAODFont });
        minuteAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(min)}`, font: minuteAODFont });
      } else {

        minuteTextWidgetB.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(min)}`, font: minuteNormalFont, x: MbX });

        minuteTextWidgetA.setProperty(prop.ANIM_STATUS, {
          anim_id: animIdMinuteA,
          anim_status: anim_status.START
        })

        minuteTextWidgetB.setProperty(prop.ANIM_STATUS, {
          anim_id: animIdMinuteB,
          anim_status: anim_status.START
        })

        if (min == 0) {
          hourTextWidgetB.setProperty(prop.MORE, {text : `${NumberToText.getHours(hour)}`, font: hourNormalFont, x: HbX });

          hourTextWidgetA.setProperty(prop.ANIM_STATUS, {
            anim_id: animIdHourA,
            anim_status: anim_status.START
          })

          hourTextWidgetB.setProperty(prop.ANIM_STATUS, {
            anim_id: animIdHourB,
            anim_status: anim_status.START
          })

        }
      }
    })

    function updateDateWidget(){
      dateTextWidget.setProperty(prop.MORE, {
        font: dateFont,
        text: `${NumberToText.getDayOfWeek(timeSensor.getDay())} ${timeSensor.getDate()} ${NumberToText.getMonth(timeSensor.getMonth()-1)}`
      })
    }

    function updateBatteryWidget(){
      if ( DEBUG ) logger.log('battery onChange: ' + batterySensor.getCurrent())
      if ( batterySensor.getCurrent() < 21 ) {
        batteryIconWidget.setProperty(prop.VISIBLE, true)
        batteryWidget.setProperty(prop.VISIBLE, true)
      } else {
        batteryIconWidget.setProperty(prop.VISIBLE, false)
        batteryWidget.setProperty(prop.VISIBLE, false)
      }
    }

    function updateStepWidget(){
      if ( DEBUG ) logger.log('step onChange')
      let currentStep = stepSensor.getCurrent()
      let targetStep = stepSensor.getTarget()
      stepArcProgressWidget.setProperty(prop.MORE, { show_level: show_level.ONLY_NORMAL,
        center_x: px(240),
        center_y: healtLine2Y+px(15),
        radius: px(36),
        start_angle: -150,
        end_angle: 150,
        color: stepArcProgressColor,
        line_width: 4,
        level: Math.round(( 100 * currentStep) / targetStep )
      })
    }

  },

  onInit() {
    logger.log('onInit invoke');
  },

  build() {
    logger.log('onBuild invoke')
    this.giova_build()
  },

  onDestroy() {
    logger.log('onDestroy invoke')
  },
})

})()
} catch (e) {
  console.log(e)
}