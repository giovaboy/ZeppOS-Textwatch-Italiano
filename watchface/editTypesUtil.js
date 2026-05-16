import { createWidget, widget, align, show_level, data_type, event, edit_type, prop } from '@zos/ui'
import { launchApp, SYSTEM_APP_SUN_AND_MOON, SYSTEM_APP_PAI, SYSTEM_APP_HR,
         SYSTEM_APP_BATTERY, SYSTEM_APP_SLEEP, SYSTEM_APP_SPO2, SYSTEM_APP_STATUS,
         SYSTEM_APP_PRESSURE, SYSTEM_APP_WEATHER, SYSTEM_APP_ALTIMETER,
         SYSTEM_APP_SPORT_STATUS, SYSTEM_APP_SPORT_HISTORY,
         SYSTEM_APP_STOP_WATCH, SYSTEM_APP_ALARM, SYSTEM_APP_COUNTDOWN } from '@zos/router'
import { Pai, Weather, Time } from '@zos/sensor'
import { px } from '@zos/utils'

// ─── Path constants ───────────────────────────────────────────────────────────
const numPath     = 'numbers_28/'
const iconBg      = 'iconbg/'
const XicPath     = 'xicon/'
const previewPath = 'preview/'
const heartPath   = 'heart/'
const UVIPath     = 'UVI/'

// ─── Image arrays ─────────────────────────────────────────────────────────────
const numArray     = Array.from({ length: 10 }, (_, i) => `${numPath}${i}.png`)
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
  [edit_type.BATTERY]:           { r:'arc',      dt: data_type.BATTERY,           icon:'bat',       bg:'bat',       color:0x06c18a, app:SYSTEM_APP_BATTERY },
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
  [edit_type.TEMPERATURE]:       { r:'pointerT', dt: data_type.WEATHER_CURRENT,   icon:'T',         bg:'t',         app:SYSTEM_APP_WEATHER,      unit:'degree', neg:true, invalid:true },
  // ── speciali ──────────────────────────────────────────────────────────────
  [edit_type.HEART]:             { r:'heart',    dt: data_type.HEART,             icon:'heart',                     app:SYSTEM_APP_HR,           invalid:true },
  [edit_type.UVI]:               { r:'uvi',      dt: data_type.UVI,               icon:'UVI',                       app:SYSTEM_APP_WEATHER,      invalid:true },
  [edit_type.MOON]:              { r:'moon',     dt: data_type.MOON,                                                 app:SYSTEM_APP_SUN_AND_MOON },
  [edit_type.WEATHER]:           { r:'weather',  dt: data_type.WEATHER_CURRENT,                     bg:'weather',   app:SYSTEM_APP_WEATHER,      unit:'degree', neg:true, invalid:'w' },
  // ── nuovi ─────────────────────────────────────────────────────────────────
  [edit_type.PAI_WEEKLY]:        { r:'paiWeekly',                                                                   app:SYSTEM_APP_PAI },
  [edit_type.SUN]:               { r:'sun',                                                                          app:SYSTEM_APP_SUN_AND_MOON },
}

// ─── Optional widget list (menu di modifica) ──────────────────────────────────
export const widgetOptionalArray = [
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
    const unitImg    = def.unit    ? numPath + def.unit + '.png' : null
    const dotImg     = def.dot     ? numPath + def.dot  + '.png' : null
    const negImg     = def.neg     ? numPath + 'negative.png'    : null
    const invalidImg = def.invalid === 'w' ? numPath + 'wnone.png'
                     : def.invalid          ? numPath + 'none.png'
                     : null

    // Sfondo quadrato con tap
    function drawBg() {
      createWidget(widget.IMG, {
        x: bgx, y: bgy, w: bgw, h: bgw, src: bgImg,
        show_level: show_level.ONLY_NORMAL,
      }).addEventListener(event.CLICK_DOWN, launch)
    }

    // Numero (TEXT_IMG) + icona piccola — usato da arc, heart, uvi, moon, pointer
    // withDot=true aggiunge isCharacter e dot_image (usato da tutti tranne temperature)
    function drawIconText(withDot = true) {
      createWidget(widget.TEXT_IMG, {
        x: numX, y: numY, w: bgw, h: numH,
        type: def.dt, font_array: numArray, h_space: 0,
        align_h: align.CENTER_H, show_level: show_level.ONLY_NORMAL,
        unit_sc: unitImg, unit_en: unitImg, unit_tc: unitImg,
        invalid_image: invalidImg, negative_image: negImg,
        ...(withDot && { isCharacter: true, dot_image: dotImg }),
      }).addEventListener(event.CLICK_DOWN, launch)

      if (iconPath) {
        createWidget(widget.IMG, {
          x: iconX, y: iconY, src: iconPath,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
      }
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
        drawIconText()
        break

      case 'numeric':
        drawBg()
        createWidget(widget.TEXT_IMG, {
          x: numX, y: numY - px(6), w: bgw, h: numH,
          type: def.dt, font_array: numArray, h_space: 0,
          align_h: align.CENTER_H, show_level: show_level.ONLY_NORMAL,
          unit_sc: unitImg, unit_en: unitImg, unit_tc: unitImg,
          invalid_image: invalidImg, dot_image: dotImg, negative_image: negImg,
        }).addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.IMG, {
          x: iconX, y: iconY - px(5), src: iconPath,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        break

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
        drawIconText(def.r === 'pointer')
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
        drawIconText()
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
        drawIconText()
        break

      case 'moon':
        createWidget(widget.IMG_LEVEL, {
          x: bgx, y: bgy, image_array: moonArray, image_length: moonArray.length,
          type: def.dt, show_level: show_level.ONLY_NORMAL,
        })
        drawIconText()
        break

      case 'weather':
        drawBg()
        createWidget(widget.TEXT_IMG, {
          x: numX, y: numY - px(6), w: bgw, h: numH,
          type: def.dt, font_array: numArray, h_space: 0,
          align_h: align.CENTER_H, show_level: show_level.ONLY_NORMAL,
          unit_sc: unitImg, unit_en: unitImg, unit_tc: unitImg,
          invalid_image: invalidImg, negative_image: negImg,
        }).addEventListener(event.CLICK_DOWN, launch)
        createWidget(widget.IMG_LEVEL, {
          x: iconX, y: iconY - px(5),
          image_array: weatherArray, image_length: weatherArray.length,
          type: data_type.WEATHER, show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)
        break

      case 'paiWeekly': {
        const BAR_W   = px(8)
        const BAR_H   = px(28)
        const BAR_GAP = px(2)
        const barXCoords = Array.from({ length: 7 },
          (_, i) => Math.round(cx - 3.5 * BAR_W - 3 * BAR_GAP + i * (BAR_W + BAR_GAP))
        )
        const barBaseY = cy - Math.round(BAR_H / 2)

        createWidget(widget.IMG, {
          x: bgx, y: bgy, w: bgw, h: bgw, src: iconBg + 'pai.png',
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)

        createWidget(widget.TEXT_IMG, {
          x: sx, y: sy + px(4), w: bgw, h: px(22),
          type: data_type.PAI_WEEKLY, font_array: numArray, h_space: 0,
          align_h: align.CENTER_H, show_level: show_level.ONLY_NORMAL,
          invalid_image: numPath + 'none.png',
        }).addEventListener(event.CLICK_DOWN, launch)

        createWidget(widget.TEXT, {
          x: sx, y: cy + px(16), w: bgw, h: px(18),
          text: 'PAI', text_size: px(14), color: 0xd612c0,
          align_h: align.CENTER_H, align_v: align.CENTER_V,
          show_level: show_level.ONLY_NORMAL,
        }).addEventListener(event.CLICK_DOWN, launch)

        // barre di sfondo
        barXCoords.forEach(bx => createWidget(widget.FILL_RECT, {
          x: bx, y: barBaseY, w: BAR_W, h: BAR_H,
          radius: Math.round(BAR_W / 2), color: 0x4a1048,
          show_level: show_level.ONLY_NORMAL,
        }))

        // barre attive (aggiornate al resume)
        const paiSensor  = new Pai()
        const barWidgets = barXCoords.map(bx => createWidget(widget.FILL_RECT, {
          x: bx, y: barBaseY, w: BAR_W, h: BAR_H,
          radius: Math.round(BAR_W / 2), color: 0xd612c0,
          show_level: show_level.ONLY_NORMAL,
        }))

        createWidget(widget.WIDGET_DELEGATE, {
          resume_call: () => {
            barWidgets.forEach((bar, i) => {
              const level  = (paiSensor[`prepai${i}`] || 0) / 100
              const height = Math.max(1, Math.min(level * BAR_H, BAR_H))
              bar.setProperty(prop.MORE, {
                x: barXCoords[i], y: barBaseY + BAR_H - height,
                w: BAR_W, h: height,
                radius: Math.round(BAR_W / 2), color: 0xd612c0,
              })
            })
          }
        })
        break
      }

      case 'sun': {
        const ARC_RADIUS = 35
        const ARC_LINE_W = 8
        const DOT_SIZE   = px(14)
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
        const dotWidget = createWidget(widget.IMG, {
          x: sx - DOT_OVER, y: sy - DOT_OVER,
          w: dotArea, h: dotArea,
          pos_x: Math.round(dotArea / 2 - DOT_SIZE / 2),
          pos_y: 0,
          center_x: Math.round(dotArea / 2),
          center_y: Math.round(dotArea / 2),
          angle: 0, src: 'widget/dot.png',
          show_level: show_level.ONLY_NORMAL,
        })

        // icona (alba / tramonto)
        const sunIconW = createWidget(widget.IMG, {
          x: cx - px(12), y: cy - px(24),
          src: 'xicon/sunrise.png', show_level: show_level.ONLY_NORMAL,
        })
        sunIconW.addEventListener(event.CLICK_DOWN, launch)

        // orario prossimo evento
        const sunTextW = createWidget(widget.TEXT, {
          x: sx, y: cy + px(8), w: bgw, h: px(22),
          text: '--:--', text_size: px(16), color: 0xffffff,
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

        createWidget(widget.WIDGET_DELEGATE, {
          resume_call: () => { _updateSun() }
        })
        break
      }
    }
  }
}
