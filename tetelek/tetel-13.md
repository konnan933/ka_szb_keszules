# 13. tétel – Erőforrás kezelés, lokalizáció, Fragment

> Ismertesse az Android platformon történő erőforrás kezelést! Hogyan lehet az egyes erőforrás elemeket elérni a kódból? Milyen erőforrásokat használhatunk, hogyan biztosítja a rendszer ezeknek a dinamikus viselkedését, és hogyan oldható meg a lokalizáció? Ismertesse az Androidos Fragment fogalmát, és vázolja fel a Fragment életciklust! Milyen módszereket ismer egy Fragment csatolására? Ismertesse a Fragmentek közötti kommunikáció lehetőségeit!

*(Forrás: Android 01–02 az erőforrásokhoz, Android 03 a Fragmentekhez)*

---

## 1. Erőforrás kezelés

- Egy Android alkalmazás **nem csak forráskódból** áll, hanem **erőforrásokból** is: képek, hangok, ikonok, szövegek, és XML-ben definiált felületek (elrendezés/layout, animáció, menü, stílus, szín).
- Erőforrások használatával az alkalmazás **rugalmasabban változtatható** (szétválik a kód és a tartalom/megjelenés).

### Elérés a kódból
- Minden erőforráshoz a rendszer (az SDK eszköz) **automatikusan egyedi azonosítót generál**, mentés után. Pl. a `res/drawable/logo.png` → **`R.drawable.logo`**.
- Az azonosítók az **`R.java`** állományban tárolódnak – **ezt soha nem szabad kézzel módosítani!**
- Hivatkozás kódból: `R.<típus>.<név>` (pl. `R.layout.activity_main`, `R.id.tvHello`, `R.string.hello`, `R.drawable.logo`). XML-ből: `@<típus>/<név>` (pl. `@string/hello`, `@drawable/logo`).
- Szöveg lekérése: `getString(R.string.timeFormat, 14)` (paraméterezhető: `%1$d`).

### Gyakori erőforrás-típusok
- **Drawable** (kép, XML drawable/shape/selector), hang/videó, UI-leíró (layout), animáció (`res/anim`), stílus/téma, szöveg (`res/values/strings.xml`), nyers (raw) állomány.

## 2. Dinamikus viselkedés és lokalizáció

### Minősítők (qualifiers) és az erőforrás-választó algoritmus
- A nagy előny: az erőforrások **a készülék képességeihez igazíthatók**. A könyvtárnév után **"minősítő"** (postfix) írható (akár több is), ami megadja, mely tulajdonságok teljesülésekor használja a rendszer azokat (pl. `values-hu`, `layout-large`, `drawable-hdpi`).
- **Futásidőben** a rendszer választ: megkeresi az aktuálisnak megfelelő minősítőjű erőforrást; ha nincs pontos, kisebb/alacsonyabb felé esik vissza (pl. `large` helyett `normal`). Ha **csak nagyobb** képernyős erőforrás van, mint a készülék → **hiba** (pl. csak `xlarge` → normal eszközön).
- Általában **nem kell minden méret/sűrűség kombinációt** megadni. A rendszer a UI-t **dp** alapján skálázza, és a képeket a sűrűség szerint átskálázza.

### Lokalizáció / internacionalizáció
- **Többnyelvűség** és nyelvfüggő felület/erőforrás. Lokalizálható típusok: **képek, elrendezések (layout), szöveges erőforrások**.
- A nyelvet/régiót a könyvtár minősítője adja: `res/values/` (alapértelmezett), **`res/values-hu/`**, `res/values-fr/` stb. (mindegyikben pl. `strings.xml`).
- **Alapértelmezett könyvtárak** (`res/drawable`, `res/layout`, `res/values`): ide esik vissza a rendszer, ha a kiválasztott lokalizációhoz nincs megfelelő erőforrás. (Android Studio: "New Resource File" + qualifier.)

## 3. A Fragment fogalma

- A **Fragment** elsősorban a **képernyő egy nagyobb részéért felelős** objektum (lehet háttérben dolgozó is). Mindig egy **Activity-hez csatoltan** jelenik meg.
- **Miért?** Nagy képernyőn több funkció fér el → bonyolult Activity-k; a fragmentekkel **modulárisabb, rugalmasabb, újrafelhasználható** architektúra építhető (pl. tableten egy Activity tartja a lista- és a részlet-fragmentet, telefonon két külön Activity).
- **Activity-hez képest**: kisebb granularitás (nem mindig teljes képernyő); az életciklusa **nem mindig egyezik** az Activity-ével (lecsatolható úgy, hogy az Activity előtérben marad). **Custom View-hoz képest**: összetett életciklus, ami az Activity-t is figyelembe veszi.

## 4. Fragment életciklus

A fragment életciklusa nagyrészt egyezik az Activity-ével, de saját callbackjei vannak:

```
onAttach()  →  onCreate()  →  onCreateView()  →  onActivityCreated()
            →  onStart()  →  onResume()       [Fragment aktív]
            →  onPause()  →  onStop()
            →  onDestroyView()  →  onDestroy()  →  onDetach()
```

- **`onAttach()`**: az Activity-hez csatolódik.
- **`onCreate()`**: létrejön (UI még nincs).
- **`onCreateView()`**: itt kell **visszaadni a megjelenítendő View-hierarchiát** (inflate). `onDestroyView()`-ben a binding nullázandó (a property csak `onCreateView` és `onDestroyView` között érvényes).
- **`onActivityCreated()`**: az Activity onCreate-je lefutott.
- **`onStart()` / `onResume()`**: láthatóvá válik / előtérbe kerül.
- **`onPause()` / `onStop()`**: háttérbe / nem látható.
- **`onDestroyView()`**: a fragment nézetét eldobja (de a fragment maga még él – pl. back stackről visszatérve újra `onCreateView()` hívódik).
- **`onDestroy()` / `onDetach()`**: megsemmisül / lecsatolódik.

## 5. Fragment csatolása

- **Statikus csatolás**: az Activity layoutjában **beégetve**, `<fragment class="..." android:tag="..." .../>` taggel. Később **nem módosítható**.
- **Dinamikus csatolás**: az Activity **futásidőben** tölti be a fragmenteket egy adott **ViewGroupba**, **FragmentTransaction**-ökkel (módosítható).
  - **FragmentManager** (`supportFragmentManager`): tranzakció indítása (`beginTransaction()`), aktív fragmentek keresése (tag/ID alapján), fragment-stack kezelése.
  - **FragmentTransaction**: **`add` / `remove` / `replace`** (le/felcsatolás), `show`/`hide`, `setCustomAnimations`/`setTransition`, **`addToBackStack(...)`** (rákerüljön-e a back stackre), végül **`commit()`**.

```kotlin
val fragment = DetailsFragment.newInstance()
val ft = supportFragmentManager.beginTransaction()
ft.replace(R.id.fragmentContainer, fragment, DetailsFragment.TAG)
ft.addToBackStack(null)   // opcionális: vissza gombbal visszaléphető
ft.commit()
```

## 6. Fragmentek közötti kommunikáció

- Egy fragmentnek **egységbe zártnak** kell lennie, ezért **közvetlenül nem** kommunikálnak egymással → **közvetett kommunikáció, az Activity közvetít**.
- Tipikus minta: a `ListFragment` egy **interfészen** (`IListFragment`) keresztül jelez az Activity-nek (`onSelected(id)`); az Activity ezt feldolgozza, és a megfelelő másik fragmentet hívja (`showDetails(id)`). Így a fragmentek nem függenek közvetlenül egymástól, csak az Activitytől / interfésztől.
- (Modern alternatívák: megosztott **ViewModel**, Fragment Result API – de a vizsga az Activity-közvetítő mintát kéri.)

---

### Kapcsolódó tételek
- Activity életciklus, Intent, Back Stack: [[tetel-12]].
- View/ViewGroup, layoutok, dp/sp (UI alapok): [[tetel-12]].
- Perzisztens tárolás, RecyclerView: [[tetel-14]].
