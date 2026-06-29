# 2. tétel – HTML, űrlapkezelés, CSS szelektorok

> Ismertesse a HTML jelölőnyelvet, kötelező elemeit és néhány további elemet! Hogyan kell űrlapkezelést megvalósítani HTML alatt? Példákon keresztül mutassa be a CSS szelektorok típusait és működési elvét!

*(Forrás: 01-es PDF – HTML rész, és 02-es PDF – CSS)*

---

## 1. A HTML jelölőnyelv

- **HTML = Hypertext Markup Language**: jelölőnyelv, ami leírja a böngészőnek, hogyan épül fel a weboldal **struktúrája**.
- **HTML elemekből** épül fel, az elemek határozzák meg, mi jelenjen meg és hogyan viselkedjen az adott rész (pl. `<img>` kép, `<table>` táblázat).
- Ma a **HTML Living Standard** (WHATWG) a szabvány; a HTML5 megengedő és visszafelé kompatibilis.

### Egy HTML elem felépítése
- **Nyitó tag**: az elem neve `<` és `>` között (nem kis-/nagybetű érzékeny, de kisbetű ajánlott).
- **Tartalom**: a két tag közötti rész.
- **Lezáró tag**: `</elemnév>`. Üres elemnek (pl. `<img>`, `<br>`) nincs lezáró tagje.

```html
<p class="editor-note">My cat is very grumpy</p>
```

### Attribútumok
- Extra információt adnak az elemhez, a **nyitó tagben**, szóközzel elválasztva, `név="érték"` formában.
- Bool attribútumnál az érték elhagyható: `disabled`, `disabled="disabled"`.
- Gyakori attribútumok: `id` (egyedi azonosító), `title` (tooltip), `class` (CSS osztály), `style` (inline CSS – kerülendő).

## 2. Kötelező elemek (oldalváz) és további elemek

### Kötelező/alapvető szerkezet
```html
<!DOCTYPE html>           <!-- a HTML verzióját/típusát adja meg -->
<html lang="hu">          <!-- gyökérelem -->
  <head>                  <!-- metaadatok, nem jelenik meg -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Oldal címe</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>                  <!-- a megjelenő tartalom -->
    <p>Helló világ!</p>
    <script src="script.js"></script>   <!-- JS-t a body vége elé -->
  </body>
</html>
```
- `<head>`: karakterkódolás, oldalcím, CSS link, egyéb meta. JS-t érdemes a `<body>` lezárása elé tenni.

### Szemantikus oldalváz elemek
`<header>`, `<nav>` (navigációs linkek), `<aside>` (oldaljegyzet), `<section>` (logikai egység), `<article>` (önállóan értelmezhető rész, pl. cikk), `<footer>`.
- **Miért jobb?** Az elemek jelentéssel bírnak (a `<div>`-nek nincs), így a böngészők, keresőmotorok (SEO) és felolvasó szoftverek értelmezhetik az oldal struktúráját.

### Blokk vs. inline elemek
- **Blokk**: mindig új sorban (pl. `<div>`, `<p>`, lista, navigációs menü, lábléc); blokkba csak blokk ágyazható.
- **Inline**: az előző elem mögött, ugyanabban a sorban (pl. `<span>`, link, vastag szöveg).

### További gyakori elemek
- Bekezdés: `<p>`. Megjelenés-formázás: `<i>` dőlt, `<b>` vastag, `<u>` aláhúzott. Szemantikus kiemelés: `<strong>` (fontos), `<em>` (kiemelt).
- Link: `<a href="..." target="_blank">`, levél: `<a href="mailto:...">`.
- Kép: `<img src="..." alt="..." width/height>` (csak az egyik méretet érdemes megadni, hogy ne torzuljon).
- Listák: `<ul>` (jelöletlen) / `<ol>` (számozott) + `<li>`.
- Táblázat: `<table>`, sorok `<tr>`, cellák `<td>`, fejléc `<thead>`/`<th scope>`, törzs `<tbody>`, cím `<caption>`.
- Média: `<audio controls>` / `<video controls>` + `<source>` (több formátum fallbackként).

## 3. Űrlapkezelés HTML alatt

### Alapszerkezet
```html
<form action="register.aspx" method="get">
  <label for="name">Név:</label>
  <input type="text" id="name" name="name" value="Gincsai Gábor">
  <br>
  <input type="submit" value="Küldés">
</form>
```
- A `<form>` adatokat kér be a felhasználótól és továbbítja a szerverre (`action` cél, `method` GET/POST).
- Részei: **címkék** (`<label>`), **beviteli mezők** (`<input type="...">`), **gombok** (`<button>`, `<input type="submit">`).

### `<input>` típusok
- Egyszerű: `text` / `password` / `number` (többsoros: `<textarea>`).
- Választós: `radio` / `checkbox`.
- Gombok: `button` / `submit` / `reset`.
- Fájl: `file`. Dátum: `date` / `datetime-local` / `month` / `time` / `week`.
- Egyéb: `email` / `range` / `search` / `tel` / `url` / `color`.

### `<label>` használata
- A megjelenített szöveg és a beviteli mező összetartozzon (a címkére kattintva a fókusz a mezőre ugrik).
- Vagy beágyazzuk az inputot a labelbe, vagy a `for="id"` attribútummal kötjük az inputhoz.

### Fontosabb input attribútumok
`placeholder` (helyőrző), `readonly`, `disabled`, `autocomplete="off"`, `autofocus`.

### Választós/listás mezők
- `<select>` + `<option>` + `<optgroup>` (csoportosítás), szűrhető `<datalist>`.
- Fájl feltöltés: `<input type="file" multiple>`, a formon `enctype="multipart/form-data"`.

### Validáció (JavaScript nélkül, HTML-ből)
- Cél: a felhasználó helyesen töltse ki az űrlapot.
- Attribútumok: `required` (kötelező), `pattern="[A-Za-z]{2}"` + `title` (regex), `maxlength`, `min`/`max`/`step`. `novalidate` kikapcsolja.
- **Validációs API** (JS-ből): `willValidate`, `validity` (ValidityState: valueMissing, tooLong, customError, valid…), `validationMessage`, `checkValidity()`, `setCustomValidity()`.
- Szép megjelenéshez pl. Bootstrap használható.

## 4. CSS szelektorok

A **CSS (Cascading Style Sheets)** a HTML elemek megjelenését szabályozza. A szabály **selectorral** kezdődik (megadja, mely elemekre vonatkozik), majd `{}`-ben kulcs-érték párokat (deklarációkat) tartalmaz:
```css
h2 {                /* selector */
  color: #A4001C;   /* property: value; */
  font-size: 26px;
}
```
A szelektor dönti el, **mely elemekre** alkalmazódjon a szabály. Típusai és működési elvük:

### a) Egyszerű szelektorok
| Szelektor | Mit jelöl ki | HTML |
|-----------|-------------|------|
| `a { }` | tetszőleges HTML tag (elem szerint) | `<a>` |
| `.osztaly { }` | a `class="osztaly"` attribútumú elemek | `<div class="osztaly">` |
| `#egyedi { }` | az `id="egyedi"` attribútumú elem | `<div id="egyedi">` |

### b) Attribútum szelektorok
- `a[href]` – ha **létezik** az attribútum.
- `a[href="https://www.aut.bme.hu"]` – ha az **értéke pontosan** ez.
- `a[href*="aut"]` – ha **tartalmazza** az "aut" szótöredéket.
- `a[href$=".bme.hu"]` – ha azzal **végződik**.
- `a[class~="logo"]` – ha (szóközzel elválasztott listában) **tartalmazza a "logo" egész szót**.

### c) Szelektorok összefűzése (szóköz nélkül = ÉS kapcsolat)
A tag/osztály/id/attribútum szelektorokat szóköz nélkül egymás után írva csak azokat az elemeket jelöli ki, **amelyekre mindegyik rész igaz**:
```css
img[src].selected { border: 1px solid red; }  /* van src ÉS rajta a selected class */
```

### d) Hierarchikus (kombinátor) szelektorok
| Szelektor | Működés |
|-----------|---------|
| `nav > .main` | **közvetlen** gyerek (csak az eggyel lejjebb lévő) |
| `nav .main` | **összes** leszármazott (akármilyen mélyen) – figyelni a szóközre! |
| `img ~ p` | **összes utána következő** testvér |
| `img + p` | **közvetlenül utána következő** testvér (csak az egy) |

### e) Univerzális szelektor
- `* { border: 1px dashed red; }` – minden elemet kijelöl. Nagyon gyenge (szinte minden felülírja), ritkán használjuk (debughoz `!important`-tal).

### f) Pszeudo-osztályok (az elem állapota alapján)
- `:visited` (meglátogatott link), `:disabled`, `:readonly`, `:first-child` (első gyerek), `:hover` (fölötte az egér).

### g) Pszeudo-elemek (az elem egy részét szabják testre)
- `::before` / `::after` (új tartalom első/utolsó gyerekként, `content` kell), `::selection` (kijelölt szöveg), `::first-letter` (első betű).

### Specifikusság (melyik szelektor "erősebb")
Ha több szabály vonatkozik egy elemre, a **specifikusabb szelektor nyer**. A specifikusság négy helyiértékből áll: (1) inline stílus, (2) id-k száma, (3) class/attribútum/pszeudo-osztály száma, (4) elem/pszeudoelem száma. Pl. `nav a` erősebb, mint `a`, ezért a `nav`-on belüli linkek máshogy nézhetnek ki. Egyenlőség esetén a **forrás sorrend** (később definiált) dönt, mindezt felülírja az `!important`.

