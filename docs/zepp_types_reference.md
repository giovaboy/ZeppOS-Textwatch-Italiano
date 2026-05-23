# ZeppOS — Riferimento `edit_type` e `data_type`

Fonti: documentazione ufficiale ZeppOS, codice hidden watchface Amazfit, repository
[Watch-face-editor-for-Amazfit-watch-on-ZeppOS](https://github.com/SashaCX75/Watch-face-editor-for-Amazfit-watch-on-ZeppOS),
sperimentazione diretta su dispositivo.

---

## `edit_type` — Zone modificabili dall'utente

Usato in `WATCHFACE_EDIT_GROUP` (`optional_types`) e come chiave di `WIDGET_DEFS`.

| Costante | Note |
|----------|------|
| `edit_type.STEP` | Passi |
| `edit_type.CAL` | Calorie bruciate |
| `edit_type.PAI` | PAI (arco + numero) |
| `edit_type.PAI_WEEKLY` | PAI settimana (barre giornaliere) |
| `edit_type.BATTERY` | Batteria % |
| `edit_type.STAND` | Ore in piedi (formato `attuale/obiettivo`) |
| `edit_type.RECOVERY_TIME` | Tempo di recupero |
| `edit_type.VO2MAX` | VO2 Max |
| `edit_type.DISTANCE` | Distanza |
| `edit_type.SLEEP` | Sonno (formato `h.mm`) |
| `edit_type.STRESS` | Stress |
| `edit_type.FAT_BURN` | Minuti fat burning |
| `edit_type.HUMIDITY` | Umidità % |
| `edit_type.ALTIMETER` | Pressione atmosferica (kPa) |
| `edit_type.ALTITUDE` | Altitudine (m) |
| `edit_type.STOP_WATCH` | Cronometro |
| `edit_type.ALARM_CLOCK` | Sveglia |
| `edit_type.COUNT_DOWN` | Timer countdown |
| `edit_type.TRAINING_LOAD` | Carico allenamento |
| `edit_type.MONTH_RUN_DISTANCE` | Distanza mensile corsa |
| `edit_type.SPO2` | Saturazione O₂ |
| `edit_type.WIND` | Vento (direzione + velocità) |
| `edit_type.TEMPERATURE` | Temperatura corporea (bodyTemp) |
| `edit_type.HEART` | Frequenza cardiaca |
| `edit_type.UVI` | Indice UV |
| `edit_type.MOON` | Fase lunare |
| `edit_type.WEATHER` | Meteo attuale (icona + temperatura) |
| `edit_type.SUN` | Alba/tramonto (arco + orario) |
| `edit_type.DATE` | Data — non in edit zone, widget fisso |
| `edit_type.WEEK` | Giorno della settimana — non in edit zone |
| `edit_type.APPLIST` | Lista app (ZeppOS v3+) |
| `edit_type.SPORTSLIST` | Lista sport (ZeppOS v3+) |

### Valori numerici noti (undocumented)

Provenienti da sperimentazione e codice hidden watchface:

| Valore | Costante corrispondente |
|--------|------------------------|
| `10003` | `edit_type.STRESS` |
| `10012` | `edit_type.BODY_TEMP` (non in edit zone) |
| `10400` | `edit_type.TEMPERATURE` (meteo) |
| `10411` | `edit_type.ALTIMETER` |
| `10603` | `edit_type.ALTITUDE` |
| `10801` | `edit_type.COUNT_DOWN` |
| `10802` | `edit_type.STOP_WATCH` |
| `10803` | `edit_type.ALARM_CLOCK` |

---

## `data_type` — Tipi di dato per widget

### Utilizzi principali

| Widget | Proprietà |
|--------|-----------|
| `TEXT_FONT` | `type: data_type.X` — valore gestito dal sistema, aggiornamento automatico |
| `ARC_PROGRESS` | `type: data_type.X` — percentuale gestita dal sistema |
| `IMG_POINTER` | `type: data_type.X` — angolo calcolato dal sistema |
| `IMG_LEVEL` | `type: data_type.X` — indice immagine calcolato dal sistema |
| `IMG_CLICK` | `type: data_type.X` — apre l'app di sistema corrispondente al tipo |

### `unit_type: 1` su `TEXT_FONT`

Aggiunge automaticamente il simbolo unità al valore (es. `%`, `°`).
Confermato funzionante per: `BATTERY`, `SPO2`, `HUMIDITY`, `WEATHER_CURRENT`.

---

## `data_type` — Riferimento completo

### Salute e fitness

| Costante | Descrizione | `TEXT_FONT` | `IMG_CLICK` (app) |
|----------|-------------|:-----------:|:-----------------:|
| `data_type.STEP` | Passi | ✓ | ✓ |
| `data_type.STEP_TARGET` | Obiettivo passi | ✓ | — |
| `data_type.CAL` | Calorie | ✓ | ✓ |
| `data_type.CAL_TARGET` | Obiettivo calorie | ✓ | — |
| `data_type.HEART` | Frequenza cardiaca | ✓ | ✓ |
| `data_type.PAI_DAILY` | PAI giornaliero | ✓ | — |
| `data_type.PAI_WEEKLY` | PAI settimanale | ✓ | ✓ |
| `data_type.DISTANCE` | Distanza | ✓ | ✓ |
| `data_type.STAND` | Ore in piedi | ✓ (stand renderer manuale) | ✓ |
| `data_type.STAND_TARGET` | Obiettivo ore in piedi | ✓ | — |
| `data_type.ACTIVITY` | Minuti attività | ✓ | — |
| `data_type.ACTIVITY_TARGET` | Obiettivo minuti attività | ✓ | — |
| `data_type.SPO2` | Saturazione O₂ | ✓ | ✓ |
| `data_type.STRESS` | Stress | ✓ | ✓ |
| `data_type.FAT_BURN` | Fat burning (display) | ✓ | — |
| `data_type.FAT_BURNING` | Fat burning (jump/target) | — | ✓ |
| `data_type.FAT_BURNING_TARGET` | Obiettivo fat burning | ✓ | — |
| `data_type.HRV` | Variabilità frequenza cardiaca | ✓ | — |
| `data_type.READINESS` | Prontezza | ✓ | — |
| `data_type.TRAINING_LOAD` | Carico allenamento | ✓ | ✓ |
| `data_type.VO2MAX` | VO2 Max | ✓ | ✓ |
| `data_type.RECOVERY_TIME` | Tempo di recupero | ✓ | ✓ |
| `data_type.BODY_TEMP` | **Temperatura corporea** | ✓ | ✓ (termometro) |
| `data_type.BATTERY` | Batteria % | ✓ | ✓ |
| `data_type.SLEEP` | Sonno | ✓ (renderer manuale) | ✓ |
| `data_type.FLOOR` | Piani saliti | ✓ | — |
| `data_type.BIO_CHARGE` | Energia corporea | ✓ | — |

### Meteo

| Costante | Descrizione | `TEXT_FONT` | `IMG_LEVEL` | `IMG_CLICK` |
|----------|-------------|:-----------:|:-----------:|:-----------:|
| `data_type.WEATHER_CURRENT` | Condizione meteo attuale (testo/numero) | ✓ | — | ✓ |
| `data_type.WEATHER` | Condizione meteo (indice icona) | — | ✓ | ✓ |
| `data_type.WEATHER_HIGH` | Temperatura massima | ✓ | — | — |
| `data_type.WEATHER_LOW` | Temperatura minima | ✓ | — | — |
| `data_type.WEATHER_HIGH_LOW` | Max+min combinati | ✓ | — | — |
| `data_type.UVI` | Indice UV | ✓ | ✓ (5 livelli) | ✓ |
| `data_type.HUMIDITY` | Umidità % | ✓ | — | ✓ |
| `data_type.WIND` | Vento (generale) | ✓ | — | ✓ |
| `data_type.WIND_SPEED` | Velocità vento | ✓ | — | — |
| `data_type.WIND_DIRECTION` | Direzione vento | — | ✓ (8 immagini) | — |
| `data_type.AQI` | Qualità dell'aria | ✓ | ✓ | ✓ |

> **Nota AQI**: `data_type.AQI` esiste ed è valido. Il widget AQI non è stato
> implementato in questa watchface perché il mapping degli indici IMG_LEVEL
> non è stato verificato su dispositivo.

### Altimetro / Pressione

| Costante | Descrizione | `TEXT_FONT` | `IMG_CLICK` |
|----------|-------------|:-----------:|:-----------:|
| `data_type.ALTIMETER` | Pressione atmosferica (kPa) | ✓ | ✓ |
| `data_type.ALTITUDE` | Altitudine (m) | ✓ | ✓ |
| `data_type.BARO` | Pressione barometrica | ✓ | — |

### Sole / Luna

| Costante | Descrizione | `IMG_LEVEL` | `IMG_CLICK` |
|----------|-------------|:-----------:|:-----------:|
| `data_type.SUN_CURRENT` | Shortcut app alba/tramonto | — | ✓ |
| `data_type.SUN_RISE` | Orario alba | ✓ | — |
| `data_type.SUN_SET` | Orario tramonto | ✓ | — |
| `data_type.MOON` | Fase lunare (indice immagine) | ✓ (29 immagini) | — |
| `data_type.MOON_CURRENT` | Shortcut app fasi lunari | — | ✓ |
| `data_type.MOON_RISE` | Orario sorgere luna | ✓ | — |
| `data_type.MOON_SET` | Orario tramonto luna | ✓ | — |

### Timer e allarmi

| Costante | Descrizione | `TEXT_FONT` | `IMG_CLICK` |
|----------|-------------|:-----------:|:-----------:|
| `data_type.COUNT_DOWN` | Countdown | ✓ | ✓ |
| `data_type.STOP_WATCH` | Cronometro | ✓ | ✓ |
| `data_type.ALARM_CLOCK` | Sveglia | ✓ | ✓ |

### Data e ora

| Costante | Descrizione | Widget |
|----------|-------------|--------|
| `data_type.NUMBER_Hour` | Ora (cifre) | `IMG_TIME` |
| `data_type.NUMBER_Minute` | Minuti (cifre) | `IMG_TIME` |
| `data_type.NUMBER_Second` | Secondi (cifre) | `IMG_TIME` |
| `data_type.NUMBER_Day` | Giorno del mese | `IMG_DATE` |
| `data_type.NUMBER_Month` | Mese | `IMG_DATE` |
| `data_type.NUMBER_Year` | Anno | `IMG_DATE` |
| `data_type.IMAGES_Month` | Mese come immagine | `IMG_LEVEL` |
| `data_type.IMAGES_Week` | Giorno settimana come immagine | `IMG_LEVEL` |

### Sport e navigazione

| Costante | Descrizione | `IMG_CLICK` |
|----------|-------------|:-----------:|
| `data_type.OUTDOOR_RUNNING` | Corsa outdoor | ✓ |
| `data_type.WALKING` | Camminata | ✓ |
| `data_type.OUTDOOR_CYCLING` | Ciclismo outdoor | ✓ |
| `data_type.FREE_TRAINING` | Allenamento libero | ✓ |
| `data_type.POOL_SWIMMING` | Nuoto in piscina | ✓ |
| `data_type.OPEN_WATER_SWIMMING` | Nuoto in acque libere | ✓ |
| `data_type.BREATH_TRAIN` | Esercizi di respirazione | ✓ |
| `data_type.COMPASS` | Bussola | ✓ |

---

## Pattern d'uso

### `TEXT_FONT` — valore gestito dal sistema
```js
createWidget(widget.TEXT_FONT, {
  type: data_type.STEP,
  unit_type: 0,        // 1 = aggiunge simbolo unità (%, °, …)
  text_size: px(26),
  color: 0xffffff,
  // …
})
```

### `IMG_CLICK` — navigazione app di sistema
```js
createWidget(widget.IMG_CLICK, {
  x, y, w, h,
  type: data_type.HEART,   // apre l'app corrispondente
  show_level: show_level.ONLY_NORMAL,
})
```
> Non richiede `launchApp` né import da `@zos/router`.

### `IMG_LEVEL` — immagine in base al livello del dato
```js
const arr = Array.from({ length: N }, (_, i) => `folder/${i + 1}.png`)
createWidget(widget.IMG_LEVEL, {
  image_array: arr,
  image_length: arr.length,
  type: data_type.UVI,     // il sistema sceglie l'indice
})
```

### `ARC_PROGRESS` — arco in base al dato
```js
createWidget(widget.ARC_PROGRESS, {
  type: data_type.BATTERY,
  // …
})
```

---

## Note importanti

- **`FAT_BURN` vs `FAT_BURNING`**: `data_type.FAT_BURN` per il display, `data_type.FAT_BURNING` per `IMG_CLICK` e come target. Confermato dall'editor GUI.
- **`WEATHER_CURRENT` vs `WEATHER`**: `WEATHER_CURRENT` = valore numerico temperatura per `TEXT_FONT`; `WEATHER` = indice condizione meteo per `IMG_LEVEL` (icone). Usare il tipo corretto per ogni widget.
- **`BODY_TEMP` non ha `edit_type`**: non può essere una zona modificabile, ma funziona come widget standalone e come shortcut `IMG_CLICK`.
- **`AQI`**: esiste e funziona, ma il mapping degli indici per `IMG_LEVEL` non è documentato.
- **`unit_type: 1`**: funziona solo su `TEXT_FONT`, non su `TEXT`. Confermato su batteria, SPO2, umidità.
