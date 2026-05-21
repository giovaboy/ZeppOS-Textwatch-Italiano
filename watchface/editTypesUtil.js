import { createWidget, widget, align, show_level, data_type, event, edit_type, prop } from '@zos/ui'
import { launchApp, SYSTEM_APP_SUN_AND_MOON, SYSTEM_APP_PAI, SYSTEM_APP_HR,
         SYSTEM_APP_BATTERY, SYSTEM_APP_SLEEP, SYSTEM_APP_SPO2, SYSTEM_APP_STATUS,
         SYSTEM_APP_PRESSURE, SYSTEM_APP_WEATHER, SYSTEM_APP_ALTIMETER,
         SYSTEM_APP_SPORT_STATUS, SYSTEM_APP_SPORT_HISTORY,
         SYSTEM_APP_STOP_WATCH, SYSTEM_APP_ALARM, SYSTEM_APP_COUNTDOWN,
         SYSTEM_APP_THERMOMETER } from '@zos/router'
import { Weather, Time, Pai, Step, Battery, HeartRate, BloodOxygen, Stress, Sleep, Barometer, Stand, Distance, Calorie, FatBurning, BodyTemperature } from '@zos/sensor'
import { px } from '@zos/utils'

// ─── Sensor cache (module-level, shared across all slots) ─────────────────────
const _sc = {}
function _sen(key, Cls) {
  if (!(key in _sc)) { try { _sc[key] = new Cls() } catch(_) { _sc[key] = null } }
  return _sc[key]
}

// Returns a function () → formatted string for a given widget def
function _makeReader(def) {
  return () => {
    try {
      const dt = def.dt
      if (dt === data_type.STEP)      { const v = _sen('step',  Step    )?.getCurrent?.();        return v > 0 ? String(v)               : '--' }
      if (dt === data_type.CAL)       { const v = _sen('cal',   Calorie )?.getCurrent?.();        return v > 0 ? String(v)               : '--' }
      if (dt === data_type.BATTERY)   { const v = _sen('bat',   Battery )?.getCurrent?.();        return v != null ? v + '%'             : '--' }
      if (dt === data_type.STAND)     {
        const s = _sen('stand', Stand)
        const v = s?.getCurrent?.(), g = s?.getTarget?.()
        return (v != null && g != null) ? `${v}/${g}` : '--'
      }
      if (dt === data_type.DISTANCE)  { const d = _sen('dist',  Distance)?.getCurrent?.();        return d > 0 ? (d/1000).toFixed(2)     : '--' }
      if (dt === data_type.FAT_BURN)  { const v = _sen('fat',   FatBurning)?.getCurrent?.();      return v > 0 ? String(v)               : '--' }
      if (dt === data_type.SPO2)      {
        if (!_sc['spo2_hm']) {
          try { _sc['spo2_hm'] = hmSensor.createSensor(hmSensor.id.SPO2) } catch(_) { _sc['spo2_hm'] = null }
        }
        const s = _sc['spo2_hm']
        const hourAvg = s?.hourAvgofDay || []
        console.log('[sensor] spo2 retcode:', s?.retcode, 'current:', s?.current)
        console.log('[sensor] spo2 hourAvgofDay (last 5):', JSON.stringify(hourAvg.slice(-5)))
        const v = (s?.retcode === 2) ? s.current : hourAvg.filter(x => x > 0).pop()
        return v != null ? v + '%' : '--'
      }
      if (dt === data_type.HEART)     {
        const v = _sen('hr', HeartRate)?.getLast?.()
        console.log('[sensor] heart getLast:', v)
        return v > 0 ? String(v) : '--'
      }
      if (dt === data_type.STRESS)    {
        const v = _sen('stress', Stress)?.getCurrent?.()?.value
        console.log('[sensor] stress getCurrent:', v)
        return v > 0 ? String(v) : '--'
      }
      if (dt === data_type.ALTIMETER) { const v = _sen('baro',   Barometer)?.getAltitude?.();      return v != null ? String(Math.round(v)) : '--' }
      if (dt === data_type.SLEEP)     {
        if (!_sc['sleep_hm']) {
          try { _sc['sleep_hm'] = hmSensor.createSensor(hmSensor.id.SLEEP) } catch(_) { _sc['sleep_hm'] = null }
        }
        const s = _sc['sleep_hm']
        s?.updateInfo?.()
        const mins = s?.getTotalTime?.()
        return mins > 0 ? `${Math.floor(mins/60)}.${String(mins%60).padStart(2,'0')}` : '--'
      }
      if (def.bodyTemp) {
        const cur = _sen('bodyT', BodyTemperature)?.getCurrent?.()
        console.log('[sensor] bodyTemp getCurrent:', JSON.stringify(cur))
        const v = cur?.value
        return (v != null && v > 0) ? (v / 100).toFixed(1) + '°' : '--'
      }
      if (dt === data_type.WIND) {
        const fc = _sen('wx', Weather)?.getForecast?.()
        console.log('[sensor] weather getForecast wind:', JSON.stringify(fc?.forecastData?.data?.[0]))
        return '--' // wind not available in ZeppOS Weather API
      }
      if (dt === data_type.WEATHER_CURRENT) {
        const fc = _sen('wx', Weather)?.getForecast?.()
        console.log('[sensor] weather getForecast:', JSON.stringify(fc?.forecastData?.data?.[0]))
        const day = fc?.forecastData?.data?.[0]
        return day != null ? `${day.high}/${day.low}°` : '--'
      }
      if (dt === data_type.UVI) {
        const fc = _sen('wx', Weather)?.getForecast?.()
        return '--' // UVI not available in ZeppOS Weather API
      }
      if (dt === data_type.PAI_WEEKLY){ const v = _sen('pai',  Pai)?.getTotal?.(); return v != null ? String(v) : '--' }
    } catch (_) {}
    return '--'
  }
}

// ─── Path constants ───────────────────────────────────────────────────────────
const numPath     = 'numbers_28/' // solo p.png è ancora usato (IMG_POINTER)
const iconBg      = 'iconbg/'
const XicPath     = 'xicon/'
const previewPath = 'preview/'
const heartPath   = 'heart/'
const UVIPath     = 'UVI/'

// ─── Image arrays ─────────────────────────────────────────────────────────────
const weatherArray = Array.from({ length: 29 }, (_, i) => `weather/${i}.png`)
const moonArray    = Array.from({ length: 29 }, (_, i) => `moon/${i + 1}.png`)
const heartArray   = Array.from({ length: 6 },  (_, i) => `${heartPath}${i + 1}.png`)
const uviArray     = Array.from({ length: 5 },   (_, i) => `${UVIPath}${i + 1}.png`)

// ─── Slot geometry ────────────────────────────────────────────────────────────
// Associa edit_id → x di partenza; y è comune a tutti e tre gli slot
const SLOT_X = { 110: 42, 111: 194, 112: 346 }
const SLOT_Y = 290

// ─── Widget definitions ───────────────────────────────────────────────────────
// r:       renderer ('arc' | 'numeric' | 'pointer' | 'pointerT' |
//                    'heart' | 'uvi' | 'moon' | 'weather' | 'paiWeekly' | 'sun')
// dt:      data_type per TEXT_IMG / ARC_PROGRESS / IMG_POINTER
// icon:    stem per xicon/  (es. 'step' → xicon/step.png)
// bg:      stem per iconbg/ (es. 'step' → iconbg/step.png)
// color:   colore arco (solo renderer 'arc')
// app:     appId per launchApp
// unit:    stem unità misura in numPath (es. 'degree', 'percent')
// dot:     stem punto decimale in numPath (es. 'point', 'slash')
// neg:     true → usa numPath/negative.png
// invalid: true → none.png | 'w' → wnone.png
// params:  parametri opzionali per launchApp
const WIDGET_DEFS = {
  // ── arco + numero + icona ──────────────────────────────────────────────────
  [edit_type.STEP]:              { r:'arc',      dt: data_type.STEP,              icon:'step',      bg:'step',      color:0x06a5ff, app:SYSTEM_APP_STATUS },
  [edit_type.CAL]:               { r:'arc',      dt: data_type.CAL,               icon:'kcal',      bg:'cal',       color:0xdf4f26, app:SYSTEM_APP_STATUS },
  [edit_type.PAI]:               { r:'arc',      dt: data_type.PAI_WEEKLY,        icon:'Pai',       bg:'pai',       color:0xd612c0, app:SYSTEM_APP_PAI },
  [edit_type.BATTERY]:           { r:'arc',      dt: data_type.BATTERY,           icon:'bat',       bg:'bat',       color:0x06c18a, app:SYSTEM_APP_STATUS },
  [edit_type.STAND]:             { r:'arc',      dt: data_type.STAND,             icon:'stand',     bg:'step',      color:0x06a5ff, app:SYSTEM_APP_STATUS,       dot:'slash' },
  [edit_type.RECOVERY_TIME]:     { r:'arc',      dt: data_type.RECOVERY_TIME,     icon:'recovery',  bg:'recovery',  color:0x06a5ff, app:SYSTEM_APP_SPORT_STATUS },
  [edit_type.VO2MAX]:            { r:'arc',      dt: data_type.VO2MAX,            icon:'vo2',       bg:'vo2',       color:0x06a5ff, app:SYSTEM_APP_SPORT_STATUS, params:{page:1} },
  // ── sfondo + numero + icona ───────────────────────────────────────────────
  [edit_type.DISTANCE]:          { r:'numeric',  dt: data_type.DISTANCE,          icon:'dis',       bg:'dis',       app:SYSTEM_APP_STATUS,       dot:'point', invalid:true },
  [edit_type.SLEEP]:             { r:'numeric',  dt: data_type.SLEEP,             icon:'sleep',     bg:'sleep',     app:SYSTEM_APP_SLEEP,        dot:'point', invalid:true },
  [edit_type.STRESS]:            { r:'numeric',  dt: data_type.STRESS,            icon:'pressure',  bg:'kpa',       app:SYSTEM_APP_PRESSURE,     invalid:true },
  [edit_type.FAT_BURN]:          { r:'numeric',  dt: data_type.FAT_BURN,          icon:'sport',     bg:'sport',     app:SYSTEM_APP_STATUS,       dot:'point', invalid:true },
  [edit_type.ALTIMETER]:         { r:'numeric',  dt: data_type.ALTIMETER,         icon:'Kpa',       bg:'kpa',       app:SYSTEM_APP_ALTIMETER,    invalid:true },
  [edit_type.STOP_WATCH]:        { r:'numeric',  dt: data_type.STOP_WATCH,        icon:'stopwatch', bg:'dis',       app:SYSTEM_APP_STOP_WATCH,   dot:'point', invalid:true },
  [edit_type.ALARM_CLOCK]:       { r:'numeric',  dt: data_type.ALARM_CLOCK,       icon:'alarm',     bg:'dis',       app:SYSTEM_APP_ALARM,        dot:'point', invalid:true },
  [edit_type.COUNT_DOWN]:        { r:'numeric',  dt: data_type.COUNT_DOWN,        icon:'stopwatch', bg:'dis',       app:SYSTEM_APP_COUNTDOWN,    dot:'point', invalid:true },
  [edit_type.TRAINING_LOAD]:     { r:'numeric',  dt: data_type.TRAINING_LOAD,     icon:'recovery',  bg:'recovery',  app:SYSTEM_APP_SPORT_STATUS, invalid:true },
  [edit_type.MONTH_RUN_DISTANCE]:{ r:'numeric',  dt: data_type.MONTH_RUN_DISTANCE,icon:'run',       bg:'recovery',  app:SYSTEM_APP_SPORT_HISTORY,invalid:true },
  // ── puntatore rotante ─────────────────────────────────────────────────────
  [edit_type.SPO2]:              { r:'pointer',  dt: data_type.SPO2,              icon:'spo2',      bg:'spo2',      app:SYSTEM_APP_SPO2,         unit:'percent', invalid:true },
  [edit_type.WIND]:              { r:'pointer',  dt: data_type.WIND,              icon:'wind',      bg:'wind',      app:SYSTEM_APP_WEATHER,      invalid:true },
  [edit_type.TEMPERATURE]:       { r:'pointerT', bodyTemp: true, dt: data_type.WEATHER_CURRENT, icon:'T', bg:'t', app:SYSTEM_APP_THERMOMETER, invalid:true },
  // ── speciali ──────────────────────────────────────────────────────────────
  [edit_type.HEART]:             { r:'heart',    dt: data_type.HEART,             icon:'heart',                     app:SYSTEM_APP_HR,           invalid:true },
  [edit_type.UVI]:               { r:'uvi',      dt: data_type.UVI,               icon:'UVI',                       app:SYSTEM_APP_WEATHER,      invalid:true },
  [edit_type.MOON]:              { r:'moon',     dt: data_type.MOON,                                                app:SYSTEM_APP_SUN_AND_MOON },
  [edit_type.WEATHER]:           { r:'weather',  dt: data_type.WEATHER_CURRENT,                     bg:'weather',   app:SYSTEM_APP_WEATHER,      unit:'degree', neg:true, invalid:'w' },
  // ── nuovi ─────────────────────────────────────────────────────────────────
  [edit_type.PAI_WEEKLY]:        { r:'paiWeekly',                                                                   app:SYSTEM_APP_PAI },
  [edit_type.SUN]:               { r:'sun',                                                                         app:SYSTEM_APP_SUN_AND_MOON },
}

// Custom type for blank/empty slot
export const BLANK_TYPE = 0x186b0

// ─── Optional widget list (menu di modifica) ──────────────────────────────────
export const widgetOptionalArray = [
  { type: BLANK_TYPE,             preview: 'bg/color/prev_blank.png', title_en: 'Empty', title_sc: 'Vuoto', title_tc: 'Vuoto' },
  { type: edit_type.ALARM_CLOCK,  preview: previewPath + 'step.png'     },
  { type: edit_type.COUNT_DOWN,   preview: previewPath + 'step.png'     },
  { type: edit_type.STEP,         preview: previewPath + 'step.png'     },
  { type: edit_type.CAL,          preview: previewPath + 'kcal.png'     },
  { type: edit_type.BATTERY,      preview: previewPath + 'bat.png'      },
  { type: edit_type.HEART,        preview: previewPath + 'heart.png'    },
  { type: edit_type.UVI,          preview: previewPath + 'UVI.png'      },
  { type: edit_type.PAI,          preview: previewPath + 'Pai.png'      },
  { type: edit_type.DISTANCE,     preview: previewPath + 'dis.png'      },
  { type: edit_type.STAND,        preview: previewPath + 'stand.png'    },
  { type: edit_type.SPO2,         preview: previewPath + 'spo2.png'     },
  { type: edit_type.STRESS,       preview: previewPath + 'pressure.png' },
  { type: edit_type.SLEEP,        preview: previewPath + 'sleep.png'    },
  { type: edit_type.WIND,         preview: previewPath + 'wind.png'     },
  { type: edit_type.WEATHER,      preview: previewPath + 'weather.png'  },
  { type: edit_type.TEMPERATURE,  preview: previewPath + 'T.png'        },
  { type: edit_type.FAT_BURN,     preview: previewPath + 'sport.png'    },
  { type: edit_type.ALTIMETER,    preview: previewPath + 'Kpa.png'      },
  { type: edit_type.MOON,         preview: previewPath + 'moon.png'     },
  { type: edit_type.PAI_WEEKLY,   preview: previewPath + 'Pai.png'      },
  { type: edit_type.SUN,          preview: previewPath + 'sun.png'      },
]

// ─── Renderer ─────────────────────────────────────────────────────────────────
export default class EditTypesUtil {

  static drawWidget(editType, slotId) {
    const slotBaseX = SLOT_X[slotId]
    if (slotBaseX === undefined) return
    const def = WIDGET_DEFS[editType]
    if (!def) return

    // Geometria slot
    const sx  = px(slotBaseX)
    const sy  = px(SLOT_Y)
    const bgx = sx + px(4)
    const bgy = sy + px(4)
    const bgw = px(92)
    const numX  = sx
    const numY  = sy + px(32)
    const numH  = px(20)
    const iconX = sx + px(30)
    const iconY = sy + px(56)
    const cx = sx + px(46)
    const cy = sy + px(46)

    // Asset derivati dalla definizione
    const launch     = () => launchApp({ appId: def.app, native: true, params: def.params })
    const iconPath   = def.icon    ? XicPath + def.icon + '.png' : null
    const bgImg      = def.bg      ? iconBg  + def.bg  + '.png' : null
    // Sfondo quadrato con tap
    function drawBg() {
      createWidget(widget.IMG, {
        x: bgx, y: bgy, w: bgw, h: bgw, src: bgImg,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, launch)
    }

    // Numero (TEXT) + icona piccola — usato da arc, heart, uvi, moon, pointer
    function drawIconText(getValue) {
      const tw = createWidget(widget.TEXT, {
        x: numX, y: numY, w: bgw, h: numH,
        text: getValue(), text_size: px(20), color: 0xffffff,
        align_h: align.CENTER_H, align_v: align.CENTER_V,
        show_level: show_level.ONLY_NORMAL,
      })
      tw.addEventListener(event.CLICK_DOWN, launch)
      if (iconPath) {
        createWidget(widget.IMG, {
          x: iconX, y: iconY, src: iconPath,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
      }
      createWidget(widget.WIDGET_DELEGATE, {
        resume_call: () => tw.setProperty(prop.MORE, { text: getValue() })
      })
    }

    switch (def.r) {

      case 'arc':
        drawBg()
        createWidget(widget.ARC_PROGRESS, {
          x: 0, y: 0, w: bgw, h: bgw,
          center_x: cx, center_y: cy,
          radius: 35, start_angle: -139, end_angle: 139,
          line_width: 8, color: def.color, type: def.dt,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        drawIconText(_makeReader(def))
        break

      case 'numeric': {
        drawBg()
        const getVal = _makeReader(def)
        const tw = createWidget(widget.TEXT, {
          x: numX, y: numY - px(6), w: bgw, h: numH,
          text: getVal(), text_size: px(20), color: 0xffffff,
          align_h: align.CENTER_H, align_v: align.CENTER_V,
          show_level: show_level.ONLY_NORMAL,
        })
        tw.addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.IMG, {
          x: iconX, y: iconY - px(5), src: iconPath,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.WIDGET_DELEGATE, {
          resume_call: () => tw.setProperty(prop.MORE, { text: getVal() })
        })
        break
      }

      case 'pointer':
      case 'pointerT':
        drawBg()
        createWidget(widget.IMG_POINTER, {
          src: numPath + 'p.png',
          center_x: cx, center_y: cy,
          x: px(6), y: px(40),
          type: def.dt, start_angle: -135, end_angle: 135,
          show_level: show_level.ONLY_NORMAL,
        })
        drawIconText(_makeReader(def))
        break

      case 'heart':
        createWidget(widget.IMG, {
          x: bgx, y: bgy, alpha: 255, src: heartPath + 'heart0.png',
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.IMG_LEVEL, {
          x: bgx, y: bgy, image_array: heartArray, image_length: heartArray.length,
          type: def.dt, show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        drawIconText(_makeReader(def))
        break

      case 'uvi':
        createWidget(widget.IMG, {
          x: bgx, y: bgy, alpha: 255, src: UVIPath + 'uvi0.png',
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.IMG_LEVEL, {
          x: bgx, y: bgy, image_array: uviArray, image_length: uviArray.length,
          type: def.dt, show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        drawIconText(_makeReader(def))
        break

      case 'moon':
        createWidget(widget.IMG_LEVEL, {
          x: bgx, y: bgy, image_array: moonArray, image_length: moonArray.length,
          type: def.dt, show_level: show_level.ONLY_NORMAL,
        })
        drawIconText(_makeReader(def))
        break

      case 'weather': {
        drawBg()
        const getVal = _makeReader(def)
        const tw = createWidget(widget.TEXT, {
          x: numX, y: numY - px(6), w: bgw, h: numH,
          text: getVal(), text_size: px(20), color: 0xffffff,
          align_h: align.CENTER_H, align_v: align.CENTER_V,
          show_level: show_level.ONLY_NORMAL,
        })
        tw.addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.IMG_LEVEL, {
          x: iconX, y: iconY - px(5),
          image_array: weatherArray, image_length: weatherArray.length,
          type: data_type.WEATHER, show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.WIDGET_DELEGATE, {
          resume_call: () => tw.setProperty(prop.MORE, { text: getVal() })
        })
        break
      }

      case 'paiWeekly': {
        const BAR_W   = px(8)
        const BAR_H   = px(28)
        const BAR_GAP = px(2)
        const barXCoords = Array.from({ length: 7 },
          (_, i) => Math.round(cx - 3.5 * BAR_W - 3 * BAR_GAP + i * (BAR_W + BAR_GAP))
        )
        const barBaseY = cy - Math.round(BAR_H / 2)

        const paiTextW = createWidget(widget.TEXT, {
          x: sx, y: sy + px(6), w: bgw, h: px(22),
          text: '--', text_size: px(20), color: 0xffffff,
          align_h: align.CENTER_H, show_level: show_level.ONLY_NORMAL,
        })
        paiTextW.addEventListener(event.CLICK_DOWN, launch)

        createWidget(widget.IMG, {
          x: iconX, y: iconY, src: XicPath + 'Pai.png',
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)

        // barre di sfondo
        barXCoords.forEach(bx => createWidget(widget.FILL_RECT, {
          x: bx, y: barBaseY, w: BAR_W, h: BAR_H,
          radius: Math.round(BAR_W / 2), color: 0x4a1048,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch))

        // barre attive — inizializzate vuote, aggiornate subito e al resume
        let paiSensor = null
        try { paiSensor = new Pai() } catch (_) {}

        const barWidgets = barXCoords.map(bx => {
          const bar = createWidget(widget.FILL_RECT, {
            x: bx, y: barBaseY + BAR_H - 1, w: BAR_W, h: 1,
            radius: Math.round(BAR_W / 2), color: 0xd612c0,
            show_level: show_level.ONLY_NORMAL,
          })
          bar.addEventListener(event.CLICK_DOWN, launch)
          return bar
        })

        function _updatePaiBars() {
          if (!paiSensor) return
          const total = paiSensor.getTotal()
          paiTextW.setProperty(prop.MORE, { text: total != null ? String(total) : '--' })
          // getLastWeek(): index 0 = oggi, index 6 = 6 giorni fa → invertiamo per barre cronologiche (sx=vecchio, dx=oggi)
          const week = [...(paiSensor.getLastWeek() || [])].reverse()
          const maxVal = 75
          barWidgets.forEach((bar, i) => {
            const height = Math.round((week[i] / maxVal) * BAR_H)
            bar.setProperty(prop.MORE, {
              x: barXCoords[i], y: barBaseY + BAR_H - height,
              w: BAR_W, h: height,
              radius: Math.round(BAR_W / 2), color: 0xd612c0,
            })
          })
        }

        _updatePaiBars()

        createWidget(widget.WIDGET_DELEGATE, {
          resume_call: () => { _updatePaiBars() }
        })
        break
      }

      case 'sun': {
        const ARC_RADIUS = 35
        const ARC_LINE_W = 8
        const DOT_OVER   = px(1)
        const dotArea    = px(92) + 2 * DOT_OVER

        // arco sfondo (cerchio completo, dimmed)
        createWidget(widget.ARC_PROGRESS, {
          center_x: cx, center_y: cy,
          radius: ARC_RADIUS, start_angle: 0, end_angle: 360,
          color: 0x333344, line_width: ARC_LINE_W,
          level: 100, corner_flag: 0, show_level: show_level.ONLY_NORMAL,
        })

        // arco attivo (alba → tramonto)
        const dayArc = createWidget(widget.ARC_PROGRESS, {
          center_x: cx, center_y: cy,
          radius: ARC_RADIUS, start_angle: 0, end_angle: 0,
          color: 0xffaa00, line_width: ARC_LINE_W,
          level: 100, corner_flag: 0, show_level: show_level.ONLY_NORMAL,
        })

        // punto rotante sulla posizione del sole
        const DOT_CX = Math.round(dotArea / 2)
        const DOT_CY = Math.round(dotArea / 2)
        // p.png is 12×80: white dot at y=0..7 (center ~y=4), transparent rest
        // pos_x centers the 12px image at DOT_CX; pos_y places dot center at ARC_RADIUS from rotation center
        const dotWidget = createWidget(widget.IMG, {
          x: sx - DOT_OVER, y: sy - DOT_OVER,
          w: dotArea, h: dotArea,
          pos_x: DOT_CX - 6,
          pos_y: DOT_CY - ARC_RADIUS - 4,
          center_x: DOT_CX,
          center_y: DOT_CY,
          angle: 0, src: numPath + 'p.png',
          show_level: show_level.ONLY_NORMAL,
        })

        // icona (alba / tramonto)
        const sunIconW = createWidget(widget.IMG, {
          x: cx - px(16), y: cy - px(24),
          src: 'xicon/sunrise.png', show_level: show_level.ONLY_NORMAL,
        })
        sunIconW.addEventListener(event.CLICK_DOWN, launch)

        // orario prossimo evento
        const sunTextW = createWidget(widget.TEXT, {
          x: sx, y: cy + px(8), w: bgw, h: px(22),
          text: '--:--', text_size: px(20), color: 0xffffff,
          align_h: align.CENTER_H, align_v: align.CENTER_V,
          show_level: show_level.ONLY_NORMAL,
        })
        sunTextW.addEventListener(event.CLICK_DOWN, launch)

        const sunWeather = new Weather()
        const sunTime    = new Time()

        // Legge i dati meteo una sola volta; null se non disponibili
        function _getTideDay() {
          try {
            const td = sunWeather.getForecast().tideData
            if (!td || !td.count) return null
            const day = td.data[0] || {}
            if (!day.sunrise || !day.sunset) return null
            return day
          } catch (e) { return null }
        }

        function _updateSun() {
          const day = _getTideDay()
          if (!day) return

          const riseMins  = day.sunrise.hour * 60 + day.sunrise.minute
          const setMins   = day.sunset.hour  * 60 + day.sunset.minute
          const dayDur    = setMins >= riseMins ? setMins - riseMins : (24 * 60 - riseMins + setMins)
          const halfAngle = (360 * dayDur / (24 * 60)) / 2

          dayArc.setProperty(prop.MORE, {
            center_x: cx, center_y: cy,
            radius: ARC_RADIUS, start_angle: -halfAngle, end_angle: halfAngle,
            color: 0xffaa00, line_width: ARC_LINE_W,
            level: 100, corner_flag: 0, show_level: show_level.ONLY_NORMAL,
          })

          const noon     = (riseMins + dayDur / 2) % (24 * 60)
          const midnight = (noon + 12 * 60) % (24 * 60)
          const nowMins  = sunTime.getHours() * 60 + sunTime.getMinutes()
          let diff = nowMins - midnight
          if (diff < 0) diff += 24 * 60
          dotWidget.setProperty(prop.MORE, { angle: diff / (24 * 60) * 360 - 180 })

          const isDay  = nowMins >= riseMins && nowMins <= setMins
          const evType = isDay ? 'sunset' : 'sunrise'
          const obj    = isDay ? day.sunset : day.sunrise
          const hh = obj.hour.toString().padStart(2, '0')
          const mm = obj.minute.toString().padStart(2, '0')
          sunTextW.setProperty(prop.MORE, { text: `${hh}:${mm}` })
          sunIconW.setProperty(prop.MORE, { src: `xicon/${evType}.png` })
        }

        _updateSun()
        createWidget(widget.WIDGET_DELEGATE, {
          resume_call: () => { _updateSun() }
        })
        break
      }
    }
  }
}
