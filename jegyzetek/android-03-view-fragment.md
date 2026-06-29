# Jegyzet – Android 03: View, Menu, Style, Animation, Fragment

*(A View-hierarchia, layoutok, dp/sp, padding/margin részletek átfedik az Android 02-t – lásd [[android-02-activity-intent]]. Itt az új tartalom.)*

## View-k (widgetek)
- Minden UI-elem a **`View`-ból** származik; a layoutok **`ViewGroup`** leszármazottak (a ViewGroup is View), egymásba ágyazhatók; saját View/ViewGroup is készíthető/kiterjeszthető.
- Gyakori widgetek: Button, EditText, CheckBox, RadioButton, ToggleButton, ImageButton, ListView, GridView, Spinner, AutoCompleteTextView, Gallery, ImageSwitcher, DatePicker, TimePicker, ProgressBar, SeekBar, RatingBar.

## Dinamikus UI – LayoutInflater
- **Feladata: XML-ben összeállított felületi elemek példányosítása** (View-objektummá "felfújása").
- `val v = layoutInflater.inflate(R.layout.activity_main, null)` (érdemes megadni a szülő layoutot a helyes méretezéshez).

## Legfontosabb UI-tervezési elvek
- `wrap_content`, `match_parent`, **dp** egységek; súlyozás; **ne** legyen beégetett pixel; **ne** AbsoluteLayout; külön kép-erőforrás eltérő sűrűségekhez; szövegnél **sp**.
- **Validáció**: `setError(errorText)` (pl. EditText alatt buborék).

## Menük és Toolbar
- A menü az **ActionBar → Toolbar** része. Definiálható kódból vagy **erőforrásból** (`res/menu/*.xml`, `<menu><item .../></menu>`, almenü beágyazott `<menu>`-vel). Dinamikus menü: láthatóság, manipuláció kódból.
- Kezelés: **`onCreateOptionsMenu(menu)`**-ben `menuInflater.inflate(R.menu.mymenu, menu)`; választás: **`onOptionsItemSelected(item)`**.
- **ActionBar-specifikus** attribútumok: `android:orderInCategory`, `android:icon`, **`android:showAsAction`** (`always|withText|ifRoom|never`).
- **ActionBar → Toolbar** csere: dinamikusabb, menü-erőforrás + custom elem + manuális pozicionálás. Téma: `Theme.AppCompat.NoActionBar`; layoutban `androidx.appcompat.widget.Toolbar`; `onCreate`-ben **`setSupportActionBar(binding.toolbar)`**.

## Felugró ablakok
- **Activity dialógusként**: Manifestben `android:theme="@android:style/Theme.Dialog"`.
- **PopupWindow**: inflate + `PopupWindow(view, w, h)`, gombra `dismiss()`, megjelenítés `showAsDropDown(...)`.
- **AlertDialog**: `AlertDialog.Builder` (setMessage, setNeutralButton/setPositiveButton…, show()).
- **Toast**: rövid szöveg kis ablakban. **SnackBar**: a képernyő alján megjelenő info-sáv (Toast helyett, egyedi akcióval: `Snackbar.make(...).setAction("Undo", ...).show()`).

## Stílusok és témák
- **Stílus**: `res/values/styles.xml`-ben `<style name="..."><item name="android:textSize">22sp</item>...</style>`; használat View-n `style="@style/ExampleStyle"`.
- **Téma**: stílusként definiálva (`parent="android:Theme"`), **öröklődhet**; egész Activity-re/appra hat. Beállítás a **Manifestben**: `<activity ... android:theme="@style/CustomTheme"/>` (vagy `<application>`-ön az egész appra).

## Grafikai erőforrások XML-ben (drawable)
- Alakzatok/hátterek XML-ben: `<shape android:shape="oval|line|rectangle">` + `<gradient>`, `<stroke>` (vonal: dashWidth/dashGap), `<size>`.
- **Állapotfüggő (selector)**: pl. gombfelirat színe `res/color/...xml`, `<selector>` + `<item android:state_pressed="true" .../>`, `<item android:state_focused="true" .../>`, default. Használat: `android:textColor="@color/button_text"`.

## Animációk
- Támogatás XML-ből (`res/anim`) vagy kódból. Layout-animáció típusok: **Scale, Rotate, Translate, Alpha**. Három fő típus: **Tween**, **Frame**, **Property animator**.
- Tween XML: `<set>` + `<scale>`/`<alpha>`/`<rotate>` (interpolator, from/to, pivot, duration). Lejátszás: `AnimationUtils.loadAnimation(this, R.anim.demo)` → `view.startAnimation(anim)`.

## Fragmentek
- **Mi?** A képernyő egy nagyobb részéért felelős (vagy háttérben dolgozó) objektum. **Miért?** Nagy képernyőn több funkció → bonyolult Activity; a fragmentekkel **modulárisabb, rugalmasabb** architektúra.
- **Activity-hez képest**: kisebb granularitás (nem mindig teljes képernyő); az életciklus nem mindig egyezik (lecsatolható, miközben az Activity előtérben marad). **Custom View-hoz képest**: összetett életciklus, ami az Activity-t is figyeli (előny és hátrány is).
- **Activity-hez csatoltan** jelenik meg; életciklusuk nagyrészt egyezik.
- **Fragment életciklus**: `onAttach()` → `onCreate()` → **`onCreateView()`** → `onActivityCreated()` → `onStart()` → `onResume()` → (aktív) → `onPause()` → `onStop()` → **`onDestroyView()`** → `onDestroy()` → `onDetach()`. (A back stackről visszatérve újra `onCreateView()`.)
- **UI Fragment**: a View-hierarchiát az **`onCreateView()`** adja vissza (`binding = ...inflate(inflater, container, false); return binding.root`); `onDestroyView()`-ben a binding nullázandó.
- **Csatolás**: **statikusan** (Activity layoutjában `<fragment class="..."/>`, nem módosítható), vagy **dinamikusan** (futásidőben ViewGroupokba, FragmentTransaction-nel).
- **FragmentManager** (`supportFragmentManager`): tranzakció indítása, aktív fragmentek keresése (tag/ID alapján), fragment-stack kezelése.
- **FragmentTransaction** (`beginTransaction()`): **`add` / `remove` / `replace`**, `show`/`hide`, `setCustomAnimations`/`setTransition`, **`addToBackStack`**, és a végén **`commit()`**.
- **Fragment-kommunikáció**: a fragmentnek egységbe zártnak kell lennie → **közvetett** kommunikáció, **az Activity közvetít** (a fragment interfészen át jelez az Activity-nek, az hív egy másik fragmentet).
- **DialogFragment**: fragment dialógusként; `onCreateDialog()` (visszaadja a Dialogot, akár AlertDialog.Builderrel) vagy `onCreateView()` (saját tartalom). Egyben Fragment is (back stackre tehető, akár beágyazva is megjeleníthető).

## Navigation Component
- Egyszerűsített navigáció Activity-k, fragmentek, nézetek közt grafikus felületen.
- **Navigation graph**: XML erőforrás, ami leírja a navigációs útvonalakat (vizuális megjelenítéssel).
- **NavHost**: üres konténer, amin belül a navigáció zajlik (a nézetek váltakoznak), tipikusan **NavHostFragment**.
- **NavController**: a navigációt vezérlő/megvalósító objektum.
