# Jegyzet – 02. CSS és Bootstrap

## CSS alapok
- **CSS (Cascading Style Sheets)**: a HTML elemek megjelenését/designját szabályozza (HTML = tartalom+struktúra).
- Kulcs-érték párokat állítunk be deklaratívan a dokumentum részeire.
- Beillesztés: inline `<style>` tag a `<head>`-ben, vagy külön fájl `<link rel="stylesheet" href="style.css">`. Inline kerülendő (a HTML a tartalomért felelős).

### CSS szabály felépítése
```css
h2 {              /* selector / element */
  color: #333;    /* property: value; (declaration) */
  font-size: 150%;
}
```
- A szabály: selector + deklarációk `{}`-ben. Property → kettőspont → érték → pontosvessző.

## CSS szelektorok (lásd tétel 2)
- **Egyszerű**: elem (`a`), osztály (`.osztaly`), id (`#egyedi`).
- **Attribútum**: `a[href]`, `a[href="..."]`, `a[href*="aut"]` (tartalmaz), `a[href$=".bme.hu"]` (végződik), `a[class~="logo"]` (egész szó).
- **Összefűzés szóköz nélkül** (ÉS): `img[src].selected`.
- **Hierarchikus**: `nav > .main` (közvetlen gyerek), `nav .main` (összes leszármazott), `img ~ p` (utána következő testvérek), `img + p` (közvetlen következő testvér).
- **Univerzális**: `*` (gyenge, ritkán).
- **Pszeudo-osztály** (állapot): `:visited`, `:disabled`, `:readonly`, `:first-child`, `:hover`.
- **Pszeudo-elem** (elem része): `::before`, `::after` (content kell), `::selection`, `::first-letter`.

## Blokk vs inline elemek
- **Inline**: egymás mellé (span, a, img); nem reagál width/height/függőleges padding/margóra; reagál text-align, line-height, vertical-align-ra.
- **Blokk**: új sort kezd, kitölti a szülő szélességét (div, form).
- `display: block | inline | none | inline-block | table-cell | flex | list-item …`. `display` váltással átalakítható.
- Inline "blokkosítása": `display: block`, vagy float/position kiszakítja a folyamból.

## Méretek
- `width` alapból `auto` (kitölti a szülőt). Egységek: px, %, em (szülő betűmérete), rem (gyökér betűmérete), vw/vh (viewport).
- `height` alapból `auto` (tartalom magassága, nincs helykitöltés). **%-os magasság csak akkor működik, ha az összes felmenőnek (html, body is) van fix/% magassága** (`html, body { height: 100%; }`).

## Box model
- **margin** (blokk köré) – **border** – **padding** (border és tartalom közé) – **content**.
- **Margin collapse**: függőleges margók találkozásakor nem összeadódnak, a nagyobb érvényesül; első gyerek felső margója összevonódhat a szülőével. Float-olt elemnél nincs margin collapse.
- **content-box** (alap): `width` = csak a tartalom. **border-box**: `width` = tartalom+padding+border (régi IE így csinálta). CSS3-ban `box-sizing` állítja.
- `width: calc(50% - 2px)` – CSS3 megoldás a padding miatti túlcsordulásra.

## Támogatottság
- Futásidőben CSS-t pótolni nehéz (layout flexbox hiányában új struktúrát kíván). Polyfill, egyszerűbb CSS, erősebb specificitás.
- `@supports(display: flex){ ... }` – feltételes blokk (ismeretlen böngésző figyelmen kívül hagyja).
- **Vendor prefixek**: `-webkit-`, `-moz-`, `-ms-` – véglegesedésig prefixelt property-k (redundáns, autoprefixer generálja).

## Stílus-kaszkád (cascade) – súlyozás sorrendje
1. **Fontosság**: `!important` (kerülendő).
2. **Származás**: böngésző alap < felhasználói < szerzői (author) < fontos szerzői < fontos felhasználói.
3. **Specifikusság**: négy helyiérték (inline; #id-k; .class/attribútum/pszeudo-class; elemek/pszeudoelemek). Pl. `header#myhead ul#main-nav li > .sub-menu li.child a:not(.unimportant):hover` = 0;2;4;5.
4. **Forrás sorrend**: ami később van a fájlban / később töltődik be.

### Öröklés
- Egyes property-k öröklődnek (font-size, line-height, text-align). `inherit` (örököl), `initial` (CSS alapérték), `currentcolor` (aktuális szín).

## Dokumentumfolyam (document flow)
- HTML dokumentumformátum: normál folyam balról jobbra (inline) / fentről le (blokk).
- Blokk box-modell változás nem hat az előtte lévőkre, de hat az utánuk jövőkre.

### Folyam megtörése: position
- `position: static` (alap), `relative`, `absolute`, `fixed`. Kombinálva top/right/bottom/left/z-index-szel.
- **relative**: eltolás az eredeti helytől (a hely üresen marad), új réteg, új koordinátarendszer a gyerekek absolute pozicionálásához.
- **absolute**: kikerül a folyamból (mintha nem létezne), a legközelebbi `position: relative` szülőhöz (vagy body-hoz) képest. Blokkszerű, de nem tölti ki a szülőt → gyakran kézi width/height.
- **fixed**: mint absolute, de görgetéskor sem mozog; koordinátarendszer a viewport (vagy transform-os szülő).
- **z-index**: rétegsorrend (csak nem-static elemen). **Stacking context**: nem globális, a szülők értékei is számítanak; új context: z-index pozicionált/flex elemen, opacity<1, transform≠none.

### Folyam megtörése: float
- Eredeti cél: tartalom körbefuttatása (kép + szöveg). Kikerül a folyamból, de befolyásolja (körbefolyják). Blokkszerű, nincs margin collapse, z-index hatástalan.
- **clear**: letiltja a körbefuttatást (footer "beszorulás" megoldása).
- **Block formatting context (BFC)**: doboz, amin belül a (float-olt) folyam elrendeződik; külön BFC-k közt nincs margin collapse. BFC-t hoz létre: html gyökér, float, absolute/fixed, `overflow≠visible`, inline-block/table-cell/flex, `display: flow-root`.
- Float layoutra: Bootstrap 3 float-alapú, BS4-től flexbox.

## Bootstrap
- Előny: jó dokumentáció, reszponzív grid, kész stílusok/komponensek. BS4-től flexbox alapú.
- Ad: szemantikus tag formázás, shortcut osztályok (success, warning, text-center), űrlap/táblázat formázás.

### Grid
- **Mobile first**, 12 oszlopos. Gyökér `.container`/`.container-fluid` → `.row` → `.col-*`.
- Töréspontok: xs(<576), sm(≥576), md(≥768), lg(≥992), xl(≥1200), xxl(≥1400).
- `.col-md-*` csak a töréspont fölött; specifikusabb felülírja a kevésbé specifikusat; alapértelmezett cellaméret 12 (teljes szélesség).
- `.col` (automatikus), `.col-md-auto` (tartalom méret), `.row-cols-*` (sornál oszlopszám).
- Igazítás (flexbox): `align-self-start/center/end`, `align-items-*` a soron. Offset: `offset-md-*`, sorrend: `order-md-*`.
- Margin/padding: `{m|p}{t|b|s|e|x|y}-{breakpoint}-{0..5|auto}` pl. `me-md-3`.
- Reszponzív megjelenítés: `d-none`, `d-block`, `d-sm-none`, `d-xl-flex`.
- Reszponzív kép: `max-width:100%; height:auto;` = `.img-fluid`.
- Kész komponensek (alert, badge, card, carousel, dropdown, modal), témák.

## Flexbox
- Konténer gyerekeinek reszponzív kontrollja: igazítás, arányos méretezés, sorrend. Fő- (main) és kereszt- (cross) tengely.
- **Konténer**: `display: flex`, `flex-direction` (row/column/-reverse), `flex-wrap`, `justify-content` (főtengely: flex-start/end, center, space-between/around/evenly), `align-items` (kereszttengely: flex-start/end, center, baseline, stretch), `align-content` (többsoros sorok igazítása, van stretch is).
- **Gyerek**: `flex-grow` (0 alap, nyúlás aránya), `flex-shrink` (1 alap), `flex-basis` (auto = width/height), `flex` shorthand (`1 1 auto` rugalmas, `0 0 auto` rugalmatlan), `align-self`, `order` (0 alap). float/clear/vertical-align nem hat flex gyerekre.
