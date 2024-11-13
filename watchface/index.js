import { createWidget, deleteWidget, widget, align, text_style, prop, anim_status, show_level, data_type, event } from '@zos/ui'
import { getScene, SCENE_AOD } from '@zos/app'
import { px, log } from '@zos/utils'
import { Time, Step, Weather } from '@zos/sensor'
import { launchApp, SYSTEM_APP_CALENDAR, SYSTEM_APP_STATUS, SYSTEM_APP_HR, SYSTEM_APP_SUN_AND_MOON} from '@zos/router'
import { LocalStorage } from '@zos/storage'
import NumberToText from './numberToText.js'
import { themes } from './themes.js'

try {
  (() => {

    /*            column A              column B
    *           _|________|_
    *          |            |
    *         |              |
    * HOUR   |   ##########   |  <-- ############### +1
    *       |                  |
    * MIN    |   ##########   |  <-- ############### +1
    *         |              |
    *          |____________|
    *            |        |
    */

const DEBUG = false;
const logger = log.getLogger("textwatch-italiano");
const localStorage = new LocalStorage()

const timeSensor = new Time()
const stepSensor = new Step()
const weatherSensor = new Weather()

const showSunEventTimeTo = "01:00";//hh:mm

const dateTextSize = px(28);
const minuteTextSize = px(64);
const hourTextSize = px(64);
const healthTextSize = px(22)

const HaH = (hourTextSize * 1.25);
const HbH = HaH;
const MaH = (minuteTextSize * 1.25);
const MbH = MaH;

//balance = 480*480
const HaX = px(-30);
const MaX = HaX;

const HbX = px(540);
const MbX = HbX;

//hours Y
const HaY = px(110);
const HbY = HaY;
//minutes Y
const MaY = px(240)-((HaH)/2)-10;//px(196);
const MbY = MaY;

const HaW = px(540);
const HbW = HaW;
const MaW = HaW;
const MbW = HaW;

const dateX = px(0);
const dateY = px(400);
const dateH = (dateTextSize * 1.25);// (font size * 1.25);
const dateW = px(480);

const healtLine2Y = px(316);

const animDuration = 1000;
const animFps = 25;

let currentIdTheme = 0;
let tideDataToday = null;

const aodBgColor = 0x000000;

let dateColor;
let hourColor;
let minuteColor;
let hourAODColor;
let minuteAODColor;
let healthColor;
let stepArcProgressColor;

const dummyCharsetMinute = 'acdegimnopqrstuv';
const dummyCharsetHour = 'acdegimnopqrstuvz';
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
  anim_duration: animDuration
}

const anim_step_out = {
  anim_prop: prop.X,
  anim_from: HaX,
  anim_to: px(-570),// - (W - start x);
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

// let batteryIconWidget = null;
// let batteryWidget = null;
let stepArcProgressWidget = null;
let sunIconWidget = null;
let sunWidget = null;

WatchFace({
  //https://github.com/zepp-health/zeppos-samples/blob/main/application/3.0/3.0-feature/app-service/time_service.js

  textWatchBuild() {

    createWidget(widget.FILL_RECT, {
      x: px(0), y: px(0),
      w: px(480), h: px(480),
      color: aodBgColor, show_level: show_level.ONAL_AOD
    });

    const editBg = createWidget(widget.WATCHFACE_EDIT_BG, {
      edit_id: 101,
      x: px(0), y: px(0),show_level: show_level.ONLY_NORMAL | show_level.ONLY_EDIT,
      bg_config: themes,
      count: themes.length,
      default_id: 0,
      fg: 'edit/fg.png',
      tips_x: px(178), tips_y: px(428),
      tips_bg: 'edit/tips.png'
    });

    currentIdTheme = editBg.getProperty(prop.CURRENT_TYPE);
    tideDataToday = weatherSensor.getForecast().tideData.data[0];

    if ( currentIdTheme === undefined ) {//in AOD this will be undefined
      currentIdTheme = localStorage.getItem( 'currentIdTheme', 0 )
    } else {
      localStorage.setItem( 'currentIdTheme', currentIdTheme )
    };

    if ( DEBUG ) logger.log( 'currentThemeId: ' + currentIdTheme );

    hourColor = themes[currentIdTheme].values.hourColor;
    minuteColor = themes[currentIdTheme].values.minuteColor;
    hourAODColor = themes[currentIdTheme].values.hourAODColor;
    minuteAODColor = themes[currentIdTheme].values.minuteAODColor;
    healthColor = themes[currentIdTheme].values.healthColor;
    stepArcProgressColor = themes[currentIdTheme].values.stepArcProgressColor;
    dateColor = themes[currentIdTheme].values.dateColor;

    let screenType = getScene();

    if ( DEBUG ) {
      secondTextWidget = createWidget(widget.TEXT, {
        x: px(0),y: px(2),w: px(480), h: px(10), text_size: px(10),
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        color: 0xffffff,
        show_level: show_level.ONLY_NORMAL,
        text: String(timeSensor.getSeconds())
      });
    };

    /* DATE */
    dateTextWidget = createWidget(widget.TEXT,{ font: dateFont, text: dummyCharsetDate,
      x: dateX, y: dateY, w: dateW, h: dateH,
      text_size: dateTextSize, color: dateColor, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS
    });

    updateDateWidget();

    dateTextWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_CALENDAR, native: true })
    });

    /* HOURS */
    hourTextWidgetA = createWidget(widget.TEXT, { font: hourNormalFont, text: dummyCharsetHour,
      x: HaX, y: HaY, w: HaW, h: HaH, text_size: hourTextSize, color: hourColor, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })
    hourTextWidgetB = createWidget(widget.TEXT, { font: hourNormalFont, text: dummyCharsetHour,
      x: HbX, y: HbY, w: HbW, h: HbH, text_size: hourTextSize, color: hourColor, show_level: show_level.ONLY_NORMAL, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })
    hourAODWidget = createWidget(widget.TEXT, { font: hourAODFont, text: dummyCharsetHour,
      x: HaX, y: HaY, w: HaW, h: HaH, text_size: hourTextSize, color: hourAODColor, show_level: show_level.ONAL_AOD, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS })

    hourAODWidget.setProperty(prop.MORE, { text: `${NumberToText.getHours(timeSensor.getHours())}` });
    hourTextWidgetA.setProperty(prop.MORE, { text: `${NumberToText.getHours(timeSensor.getHours())}` });
    hourTextWidgetB.setProperty(prop.MORE, { text: '' });

    animIdHourA = hourTextWidgetA.setProperty(prop.ANIM, {
      anim_steps: [anim_step_out],
      anim_fps: animFps,
      anim_auto_start: 0,
      anim_auto_destroy: 0,
      anim_repeat: 0,
      anim_complete_func: () => {
        if ( DEBUG ) logger.log('animation complete animIdHourA');
        hourTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}`, x: HaX });
      }
    });

    animIdHourB = hourTextWidgetB.setProperty(prop.ANIM, {
      anim_steps: [anim_step_in],
      anim_fps: animFps,
      anim_auto_start: 0,
      anim_auto_destroy: 0,
      anim_repeat: 0,
      anim_complete_func: () => {
        if ( DEBUG ) logger.log('animation complete animIdHourB');
        hourTextWidgetB.setProperty(prop.MORE, {text: '', x: HbX});
      }
    });

    /* MINUTES */
    minuteTextWidgetA = createWidget(widget.TEXT, { font: minuteNormalFont, text: dummyCharsetMinute,
      show_level: show_level.ONLY_NORMAL, x: MaX, y: MaY, w: MaW, h: MaH, color: minuteColor, text_size: minuteTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS });
    minuteTextWidgetB = createWidget(widget.TEXT, { font: minuteNormalFont, text: dummyCharsetMinute,
      show_level: show_level.ONLY_NORMAL, x: MbX, y: MbY, w: MbW, h: MbH, color: minuteColor, text_size: minuteTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS });
    minuteAODWidget = createWidget(widget.TEXT, { font: minuteAODFont, text: dummyCharsetMinute,
      show_level: show_level.ONAL_AOD, x: MaX, y: MaY, w: MaW, h: MaH, color: minuteAODColor, text_size: minuteTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V, text_style: text_style.ELLIPSIS });

    minuteAODWidget.setProperty(prop.MORE, { text: `${NumberToText.getMinutes(timeSensor.getMinutes())}` });
    minuteTextWidgetA.setProperty(prop.MORE, { text: `${NumberToText.getMinutes(timeSensor.getMinutes())}` });
    minuteTextWidgetB.setProperty(prop.MORE, { text: '' });

    animIdMinuteA = minuteTextWidgetA.setProperty(prop.ANIM, {
      anim_steps: [anim_step_out],
      anim_fps: animFps,
      anim_auto_start: 0,
      anim_auto_destroy: 0,
      anim_repeat: 0,
      anim_complete_func: () => {
        if ( DEBUG ) logger.log('animation complete animIdMinuteA');
        minuteTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}`, x: MaX });
      }
    });

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
    });

    /* HEART */
    let heartIcon = createWidget(widget.IMG, {
      x: px(72), y: healtLine2Y + px(28), pos_y: px(-2), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/heart.png'
    });
    const heartWidget = createWidget(widget.TEXT_FONT,{
      x: px(58), y: healtLine2Y, w: px(60), h: px(30), text_size: healthTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.HEART,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,  //  0: hide the unit     1:show the unit with lower case    2: show the unit with upper case.
    });
    heartIcon.addEventListener(event.CLICK_DOWN, () => {
      launchApp({ appId: SYSTEM_APP_HR, native: true })
    });
    heartWidget.addEventListener(event.CLICK_DOWN, () => {
      launchApp({ appId: SYSTEM_APP_HR, native: true })
    });

    /* STEP */
    createWidget(widget.IMG, {
      x: px(224), y: healtLine2Y + px(28), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/step.png'
    });
    createWidget(widget.TEXT_FONT,{
      x: px(208), y: healtLine2Y, w: px(64), h: px(30), text_size: healthTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.STEP,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,  //  0: hide the unit     1:show the unit with lower case    2: show the unit with upper case.
    });
    stepArcProgressWidget = createWidget(widget.ARC_PROGRESS, { show_level: show_level.ONLY_NORMAL })
    stepArcProgressWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_STATUS, native: true })
    });
    updateStepWidget();

    /* DISTANCE */
    let distanceIcon = createWidget(widget.IMG, {
      x: px(376), y: healtLine2Y + px(28), align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/dis.png'
    });
    let distanceWidget = createWidget(widget.TEXT_FONT,{
      x: px(362), y: healtLine2Y, w: px(60), h: px(30), text_size: healthTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V,
      type: data_type.DISTANCE,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,  //  0: hide the unit     1:show the unit with lower case    2: show the unit with upper case.
    });
    distanceIcon.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_STATUS, native: true, params: { page: 3 } })
    });
    distanceWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_STATUS, native: true, params: { page: 3 } })
    });

    /* SUN_RISE - SUN_SET */
    sunIconWidget = createWidget(widget.IMG, {
      x: px(224), y: px(80), w: 32, align_h: align.CENTER_H, align_v: align.CENTER_V, show_level: show_level.ONLY_NORMAL,
      src: 'icons/sunrise2.png'
    });
    sunWidget = createWidget(widget.TEXT,{
      x: px(110), y: px(52), w: px(260), h: px(30), text_size: healthTextSize, align_h: align.CENTER_H, align_v: align.CENTER_V,
      text:null,
      color: healthColor, char_space: 0, padding: false, show_level: show_level.ONLY_NORMAL,
      unit_type: 0,
    });
    sunIconWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_SUN_AND_MOON, native: true })
    });
    sunWidget.addEventListener(event.CLICK_DOWN, (info) => {
      launchApp({ appId: SYSTEM_APP_SUN_AND_MOON, native: true })
    });
    updateSunWidget();


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
    //   item_height: 10,
    //   item_text_color: 0x000000,
    //   item_text_size: 8,
    //   //item_text_x: 0,
    //   //item_text_y: 0,
    //   //item_image_x: px(0),
    //   //item_bg_color: 0xffffff
    // })

    // // Get the index at the top of the scrolling list
    // const result = cycleImageTextList.getProperty(prop.MORE, {})
    // logger.log(result.index)

    // // Set the index at the top of the scrolling list
    // cycleImageTextList.setProperty(prop.LIST_TOP, { index: 3 })



    createWidget(widget.WIDGET_DELEGATE, {
      resume_call: function () {
        if ( DEBUG ) logger.log('resume_call');

        if (screenType == SCENE_AOD) {
          //batterySensor.offChange(updateBatteryWidget());
          stepSensor.offChange(updateStepWidget);
          hourTextWidgetA.setProperty(prop.MORE, {text : '', x: HaX});
          minuteTextWidgetA.setProperty(prop.MORE, {text : '', x: MaX});
          hourTextWidgetB.setProperty(prop.MORE, {text : '', x: HbX});
          minuteTextWidgetB.setProperty(prop.MORE, {text : '', x: MbX});
          hourAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}` });
          minuteAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}` });
        } else {
          if ( DEBUG ) { secondTextWidget.setProperty(prop.MORE, {text : timeSensor.getSeconds() }) }
          //batterySensor.onChange(updateBatteryWidget());
          stepSensor.onChange(updateStepWidget);
          hourTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}`, x: HaX });
          minuteTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}`, x: MaX });
          hourTextWidgetB.setProperty(prop.MORE, {text : '', x: HbX});
          minuteTextWidgetB.setProperty(prop.MORE, {text : '', x: MbX});
          hourAODWidget.setProperty(prop.MORE, {text : ''});
          minuteAODWidget.setProperty(prop.MORE, {text : ''});
          updateDateWidget();
          updateSunWidget();
        }
      },
      pause_call: function () {
        if ( DEBUG ) logger.log('ui pause');
        //batterySensor.offChange(updateBatteryWidget());
        stepSensor.offChange(updateStepWidget);
      },
    });

    if ( DEBUG ) {
      setInterval(() => {
        secondTextWidget.setProperty(prop.MORE, {text : timeSensor.getSeconds() });
      }, 1000);
    };

    /* SENSOR EVENTS */
    timeSensor.onPerDay(() => {//DOES THIS EXECUTE?
      if ( DEBUG ) logger.log('onPerDay: ' + timeSensor.getDay() + '-' + timeSensor.getMonth())
      updateDateWidget();
      tideDataToday = weatherSensor.getForecast().tideData.data[0];
    });

    timeSensor.onPerMinute(() => {
      let hour = timeSensor.getHours();
      let min = timeSensor.getMinutes();
      if ( DEBUG ) logger.log('onPerMinute: ' + hour + ':' + min);

      if (screenType == SCENE_AOD) {
        hourAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getHours(hour)}` });
        minuteAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(min)}` });
      } else {
        minuteTextWidgetB.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(min)}`, x: MbX });

        minuteTextWidgetA.setProperty(prop.ANIM_STATUS, {
          anim_id: animIdMinuteA,
          anim_status: anim_status.START
        });

        minuteTextWidgetB.setProperty(prop.ANIM_STATUS, {
          anim_id: animIdMinuteB,
          anim_status: anim_status.START
        });

        if (min == 0) {

          tideDataToday = weatherSensor.getForecast().tideData.data[0];

          hourTextWidgetB.setProperty(prop.MORE, {text : `${NumberToText.getHours(hour)}`, x: HbX });

          hourTextWidgetA.setProperty(prop.ANIM_STATUS, {
            anim_id: animIdHourA,
            anim_status: anim_status.START
          });

          hourTextWidgetB.setProperty(prop.ANIM_STATUS, {
            anim_id: animIdHourB,
            anim_status: anim_status.START
          });

        }
        updateSunWidget();
      }
    })

    function updateDateWidget(){
      dateTextWidget.setProperty(prop.MORE, {
        //text: 'mercoledi 30 settembre',
        text: `${NumberToText.getDayOfWeek(timeSensor.getDay())} ${timeSensor.getDate()} ${NumberToText.getMonth(timeSensor.getMonth())}`
      });
    }

    function updateSunWidget(){
      if ( tideDataToday == null) {
        tideDataToday = weatherSensor.getForecast().tideData.data[0];
      }

      let sunrise = tideDataToday.sunrise.hour.toString().padStart(2, '0') + ':' + tideDataToday.sunrise.minute.toString().padStart(2, '0');
      let sunset = tideDataToday.sunset.hour.toString().padStart(2, '0') + ':' + tideDataToday.sunset.minute.toString().padStart(2, '0');
      let now = timeSensor.getHours().toString().padStart(2, '0') + ':' +  timeSensor.getMinutes().toString().padStart(2, '0');

      if (now < sunrise) {
        let diff = calcTimeDiff(now, sunrise);
        if ( DEBUG ) logger.log('now=' + now + ' - sunrise=' + sunrise + ' - diff=' + diff);
        if (diff <= showSunEventTimeTo) {
          let diffArr = diff.split(':');
          sunWidget.setProperty(prop.MORE, { text: `${NumberToText.getMinutesTo(diffArr[0]*60 + diffArr[1]*1)}` });
          sunIconWidget.setProperty(prop.MORE, {src: 'icons/sunrise.png'});
          sunIconWidget.setProperty(prop.VISIBLE, true);
          sunWidget.setProperty(prop.VISIBLE, true);
        } else {
          sunIconWidget.setProperty(prop.VISIBLE, false);
          sunWidget.setProperty(prop.VISIBLE, false);
        }
      } else if (now < sunset) {
        let diff = calcTimeDiff(now, sunset);
        if ( DEBUG ) logger.log('now=' + now + ' - sunset=' + sunset + ' - diff=' + diff);
        if (diff <= showSunEventTimeTo) {
          let diffArr = diff.split(':');
          sunWidget.setProperty(prop.MORE, { text: `${NumberToText.getMinutesTo(diffArr[0]*60 + diffArr[1]*1)}` });
          sunIconWidget.setProperty(prop.MORE, {src: 'icons/sunset.png'});
          sunIconWidget.setProperty(prop.VISIBLE, true);
          sunWidget.setProperty(prop.VISIBLE, true);
        } else {
          sunIconWidget.setProperty(prop.VISIBLE, false);
          sunWidget.setProperty(prop.VISIBLE, false);
        }
      } else {
        sunIconWidget.setProperty(prop.VISIBLE, false);
        sunWidget.setProperty(prop.VISIBLE, false);
      }

    }

    function calcTimeDiff(time1, time2) {
      const [h1, m1] = time1.split(':');
      const [h2, m2] = time2.split(':');
      let diff = (h2 - h1) * 60 + (m2 - m1);
      if (diff < 0) diff += 24 * 60;
      const hours = Math.floor(diff / 60);
      const minutes = diff - hours * 60;
      const hh = hours.toString().padStart(2, '0');
      const mm = minutes.toString().padStart(2, '0');
      return `${hh}:${mm}`;
    }

    function updateStepWidget(){
      if ( DEBUG ) logger.log('step onChange');
      let currentStep = stepSensor.getCurrent();
      let targetStep = stepSensor.getTarget();
      stepArcProgressWidget.setProperty(prop.MORE, { show_level: show_level.ONLY_NORMAL,
        center_x: px(240),
        center_y: healtLine2Y+px(15),
        radius: px(36),
        start_angle: -150,
        end_angle: 150,
        color: stepArcProgressColor,
        line_width: 4,
        level: Math.round(( 100 * currentStep) / targetStep )
      });
    }

  },

  onInit() {
    logger.log('onInit invoke');
  },

  build() {
    logger.log('onBuild invoke');
    this.textWatchBuild();
  },

  onDestroy() {
    logger.log('onDestroy invoke');
    deleteWidget(dateTextWidget);
    deleteWidget(hourTextWidgetA);
    deleteWidget(hourTextWidgetB);
    deleteWidget(minuteTextWidgetA);
    deleteWidget(minuteTextWidgetB);

    deleteWidget(hourAODWidget);
    deleteWidget(minuteAODWidget);

    deleteWidget(stepArcProgressWidget);
    deleteWidget(sunIconWidget);
    deleteWidget(sunWidget);

    dateTextWidget = null;
    hourTextWidgetA = null;
    hourTextWidgetB = null;
    minuteTextWidgetA = null;
    minuteTextWidgetB = null;

    hourAODWidget = null;
    minuteAODWidget = null;

    stepArcProgressWidget = null;
    sunIconWidget = null;
    sunWidget = null;
  },
})

})()
} catch (e) {
  console.log(e);
}