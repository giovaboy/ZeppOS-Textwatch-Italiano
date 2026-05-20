import { createWidget, deleteWidget, widget, align, text_style, prop, anim_status, show_level, event, edit_type } from '@zos/ui'
import { getScene, SCENE_AOD } from '@zos/app'
import { px, log } from '@zos/utils'
import { Time } from '@zos/sensor'
import { launchApp, SYSTEM_APP_CALENDAR } from '@zos/router'
import { LocalStorage } from '@zos/storage'
import NumberToText from './numberToText.js'
import { themes } from './themes.js'
import EditTypesUtil, { widgetOptionalArray, BLANK_TYPE } from './editTypesUtil.js'
import { hourColorOptionalArray, minuteColorOptionalArray, dateColorOptionalArray, getColorFromType, COLOR_EDIT_ID, NO_OVERRIDE_TYPE } from './colorSelector.js'

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

const dateTextSize = px(28);
const minuteTextSize = px(64);
const hourTextSize = px(64);

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

const editableWidgetsIds = [110,111,112];
const editableWidgetsHW = px(92);

const animDuration = 1000;
const animFps = 25;

let currentIdTheme = 0;

const aodBgColor = 0x000000;

let dateColor;
let hourColor;
let minuteColor;
let hourAODColor;
let minuteAODColor;

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

let editGroup1 = null;
let editGroup2 = null;
let editGroup3 = null;

let colorGroupHour   = null;
let colorGroupMinute = null;
let colorGroupDate   = null;

let editBgWidget = null;


WatchFace({
  //https://github.com/zepp-health/zeppos-samples/blob/main/application/3.0/3.0-feature/app-service/time_service.js

  textWatchBuild() {

    createWidget(widget.FILL_RECT, {
      x: px(0), y: px(0),
      w: px(480), h: px(480),
      color: aodBgColor, show_level: show_level.ONAL_AOD
    });

    editBgWidget = createWidget(widget.WATCHFACE_EDIT_BG, {
      edit_id: 101,
      x: px(0), y: px(0),show_level: show_level.ONLY_NORMAL | show_level.ONLY_EDIT,
      bg_config: themes,
      count: themes.length,
      default_id: 0,
      fg: 'mask/fg_x.png',
      tips_x: px(178), tips_y: px(20),
      tips_bg: 'mask/tips.png'
    });

    currentIdTheme = editBgWidget.getProperty(prop.CURRENT_TYPE);

    if ( currentIdTheme === undefined ) {//in AOD this will be undefined
      currentIdTheme = localStorage.getItem( 'currentIdTheme', 0 )
    } else {
      localStorage.setItem( 'currentIdTheme', currentIdTheme )
    };

    if ( DEBUG ) logger.log( 'currentThemeId: ' + currentIdTheme );

    hourAODColor   = 0xffffff;
    minuteAODColor = 0xffffff;

    // ── Color zone selectors ──────────────────────────────────────────────────
    function _makeColorGroup(editId, x, y, w, h, optArray, selectImg, tipsBelow = false) {
      const grp = createWidget(widget.WATCHFACE_EDIT_GROUP, {
        edit_id: editId,
        x, y, w, h,
        select_image:    selectImg,
        un_select_image: selectImg,
        default_type: NO_OVERRIDE_TYPE,
        optional_types: optArray,
        count: optArray.length,
        tips_BG:    'mask/tips.png',
        tips_x:     Math.round((w - px(124)) / 2),
        tips_y:     tipsBelow ? h + px(8) : -px(40),
        tips_width: px(124),
        /*select_list: {
          title_font_size:          34,
          title_align_h:            align.CENTER_H,
          list_item_vspace:         8,
          list_tips_text_font_size: 32,
          list_tips_text_align_h:   align.LEFT,
        }*/
      })
      return { grp }
    }

    // Ore: rettangolo 400×80, centrato orizzontalmente, sovrapposto al testo ore (y=110, h=80)
    const csHour   = _makeColorGroup(COLOR_EDIT_ID.HOUR,   px(40),  px(110), px(400), px(80),  hourColorOptionalArray, 'mask/select_rect.png')
    // Minuti: rettangolo 400×80, centrato, sovrapposto al testo minuti
    const csMinute = _makeColorGroup(COLOR_EDIT_ID.MINUTE, px(40),  MaY,       px(400), px(80), minuteColorOptionalArray, 'mask/select_rect.png', true)
    // Data: rettangolo 480×35, full-width, sovrapposto al testo data
    const csDate   = _makeColorGroup(COLOR_EDIT_ID.DATE,   dateX,   dateY,     dateW,   dateH,  dateColorOptionalArray,   'mask/select_date.png')

    colorGroupHour   = csHour.grp
    colorGroupMinute = csMinute.grp
    colorGroupDate   = csDate.grp

    function _colorForZone(groupWidget, themeType) {
      const sel = groupWidget.getProperty(prop.CURRENT_TYPE)
      if (sel === NO_OVERRIDE_TYPE || sel === undefined) return getColorFromType(themeType)
      return getColorFromType(sel) ?? getColorFromType(themeType)
    }

    function _refreshColors() {
      const newTheme = editBgWidget.getProperty(prop.CURRENT_TYPE)
      if (newTheme !== undefined) {
        currentIdTheme = newTheme
        localStorage.setItem('currentIdTheme', currentIdTheme)
      }
      const ntc = themes[currentIdTheme].colors
      hourColor   = _colorForZone(colorGroupHour,   ntc.hour)
      minuteColor = _colorForZone(colorGroupMinute, ntc.minute)
      dateColor   = _colorForZone(colorGroupDate,   ntc.date)
    }

    _refreshColors()
    // ─────────────────────────────────────────────────────────────────────────

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

    /* 1 - HEART EDITABLE GROUP */
    editGroup1 = createWidget(widget.WATCHFACE_EDIT_GROUP, {
      edit_id: editableWidgetsIds[0],
      x: px(42), y: px(290),
      w: editableWidgetsHW, h: editableWidgetsHW,
      select_image: 'mask/select.png',
      un_select_image:  'mask/select.png',
      default_type: edit_type.HEART,
      optional_types: widgetOptionalArray,
      count: widgetOptionalArray.length,
      tips_BG: 'mask/tips.png',
      tips_x: - px((124-92)/2),
      tips_y: - px(36+4),
      tips_width: px(124),
      //tips_margin: 10 // optional, default value: 0
      select_list: {
        title_font_size : 34 ,
        title_align_h: align.CENTER_H ,
        list_item_vspace: 8,
        list_tips_text_font_size: 32,
        list_tips_text_align_h : align.LEFT,
      }
    })
    let item1 = editGroup1.getProperty(prop.CURRENT_TYPE);
    try { EditTypesUtil.drawWidget(item1, editableWidgetsIds[0]) } catch(e) { logger.log('widget 1 error: ' + e) }

    /* 2 - STEP EDITABLE GROUP */
    editGroup2 = createWidget(widget.WATCHFACE_EDIT_GROUP, {
      edit_id: editableWidgetsIds[1],
      x: px(194), y: px(290),
      w: editableWidgetsHW, h: editableWidgetsHW,
      select_image: 'mask/select.png',
      un_select_image:  'mask/select.png',
      default_type: edit_type.STEP,
      optional_types: widgetOptionalArray,
      count: widgetOptionalArray.length,
      tips_BG: 'mask/tips.png',
      tips_x: - px((124-92)/2),
      tips_y: - px(36+4),
      tips_width: px(124),
      //tips_margin: 10 // optional, default value: 0
      select_list: {
        title_font_size: 34 ,
        title_align_h: align.CENTER_H ,
        list_item_vspace: 8,
        list_tips_text_font_size: 32,
        list_tips_text_align_h : align.LEFT,
      }
    })
    let item2 = editGroup2.getProperty(prop.CURRENT_TYPE);
    try { EditTypesUtil.drawWidget(item2, editableWidgetsIds[1]) } catch(e) { logger.log('widget 2 error: ' + e) }

    /* 3 - DISTANCE EDITABLE GROUP */
    editGroup3 = createWidget(widget.WATCHFACE_EDIT_GROUP, {
      edit_id: editableWidgetsIds[2],
      x: px(346), y: px(290),
      w: editableWidgetsHW, h: editableWidgetsHW,
      select_image: 'mask/select.png',
      un_select_image:  'mask/select.png',
      default_type: edit_type.DISTANCE,
      optional_types: widgetOptionalArray,
      count: widgetOptionalArray.length,
      tips_BG: 'mask/tips.png',
      tips_x: - px((124-92)/2),
      tips_y: - px(36+4),
      tips_width: px(124),
      //tips_margin: 10 // optional, default value: 0
      select_list: {
        title_font_size :34 ,
        title_align_h: align.CENTER_H ,
        list_item_vspace: 8,
        list_tips_text_font_size: 32,
        list_tips_text_align_h : align.LEFT,
      }
    })
    let item3 = editGroup3.getProperty(prop.CURRENT_TYPE);
    try { EditTypesUtil.drawWidget(item3, editableWidgetsIds[2]) } catch(e) { logger.log('widget 3 error: ' + e) }

    createWidget(widget.WATCHFACE_EDIT_MASK, {
      x: 0, y: 0, w: px(480), h: px(480),
      src: 'mask/mask0.png',
      show_level: show_level.ONLY_EDIT
    })

    createWidget(widget.WATCHFACE_EDIT_FG_MASK, {
      x: 0, y: 0, w: px(480), h: px(480),
      src: 'mask/mask70_y290.png',
      show_level: show_level.ONLY_EDIT
    })


    createWidget(widget.WIDGET_DELEGATE, {
      resume_call: function () {
        if ( DEBUG ) logger.log('resume_call');

        if (screenType == SCENE_AOD) {
          hourTextWidgetA.setProperty(prop.MORE, {text : '', x: HaX});
          minuteTextWidgetA.setProperty(prop.MORE, {text : '', x: MaX});
          hourTextWidgetB.setProperty(prop.MORE, {text : '', x: HbX});
          minuteTextWidgetB.setProperty(prop.MORE, {text : '', x: MbX});
          hourAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}` });
          minuteAODWidget.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}` });
        } else {
          _refreshColors()
          if ( DEBUG ) { secondTextWidget.setProperty(prop.MORE, {text : timeSensor.getSeconds() }) }
          hourTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getHours(timeSensor.getHours())}`, x: HaX, color: hourColor });
          minuteTextWidgetA.setProperty(prop.MORE, {text : `${NumberToText.getMinutes(timeSensor.getMinutes())}`, x: MaX, color: minuteColor });
          hourTextWidgetB.setProperty(prop.MORE, {text : '', x: HbX});
          minuteTextWidgetB.setProperty(prop.MORE, {text : '', x: MbX});
          hourAODWidget.setProperty(prop.MORE, {text : ''});
          minuteAODWidget.setProperty(prop.MORE, {text : ''});
          updateDateWidget();
        }
      },
      pause_call: function () {
        if ( DEBUG ) logger.log('ui pause');
      },
    });

    if ( DEBUG ) {
      setInterval(() => {
        secondTextWidget.setProperty(prop.MORE, {text : timeSensor.getSeconds() });
      }, 1000);
    };

    /* SENSOR EVENTS */
    timeSensor.onPerDay(() => {
      if ( DEBUG ) logger.log('onPerDay: ' + timeSensor.getDay() + '-' + timeSensor.getMonth())
      updateDateWidget();
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
      }
    })

    function updateDateWidget(){
      dateTextWidget.setProperty(prop.MORE, {
        text: NumberToText.getDate(timeSensor.getDay(), timeSensor.getDate(), timeSensor.getMonth()),
        color: dateColor
      });
    }

  },

  onInit() {
    if ( DEBUG ) logger.log('onInit invoke');
  },

  build() {
    if ( DEBUG ) logger.log('onBuild invoke');
    this.textWatchBuild();
  },

  onDestroy() {
    if ( DEBUG ) logger.log('onDestroy invoke');
    deleteWidget(dateTextWidget);
    deleteWidget(hourTextWidgetA);
    deleteWidget(hourTextWidgetB);
    deleteWidget(minuteTextWidgetA);
    deleteWidget(minuteTextWidgetB);

    deleteWidget(hourAODWidget);
    deleteWidget(minuteAODWidget);

    deleteWidget(editGroup1);
    deleteWidget(editGroup2);
    deleteWidget(editGroup3);

    deleteWidget(colorGroupHour);
    deleteWidget(colorGroupMinute);
    deleteWidget(colorGroupDate);

    editBgWidget = null;
    dateTextWidget = null;
    hourTextWidgetA = null;
    hourTextWidgetB = null;
    minuteTextWidgetA = null;
    minuteTextWidgetB = null;

    hourAODWidget = null;
    minuteAODWidget = null;

    editGroup1 = null;
    editGroup2 = null;
    editGroup3 = null;

    colorGroupHour   = null;
    colorGroupMinute = null;
    colorGroupDate   = null;
    editBgWidget     = null;

  },
})

})()
} catch (e) {
  console.log(e);
}