# 11. tétel – Android komponensek, .apk előállítása és aláírása, Manifest

> Ismertesse az Android platformon elérhető komponenseket, illetve adjon példát a használatukra! Vázolja fel az Androidos .apk állomány előállításának menetét! Hogyan lesz a fejlesztő által előállított fájlokból aláírt .apk? Jellemezze a Manifest fájlt! Mi található benne, miket kell a fejlesztőnek feltétlenül feltüntetnie itt?

*(Forrás: Android 01 – Bevezetés, alapok, Manifest)*

---

## 1. Android alkalmazás komponensek

Egy Android alkalmazás **egy vagy több alkalmazás komponensből** épül fel. Mindegyiknek külön szerepe van, **bármelyik önállóan aktiválódhat**, és akár **másik alkalmazás is aktiválhatja**. Négy komponenstípus van:

### a) Activity
- **Különálló nézet, saját felhasználói felülettel**. Az `android.app.Activity` (gyakorlatban `AppCompatActivity`) osztályból származik.
- Független Activity-k együtt alkotják az alkalmazást; más appból is indítható.
- **Példa**: emlékeztető alkalmazás 3 Activity-vel (ToDo lista, új ToDo felvitele, ToDo részletek); a kamera app elindíthatja az "új ToDo" Activity-t és a képet hozzárendeli.
- Aktiválás: **Intent**-tel (eredmény: Result).

### b) Service
- **Hosszabb ideig háttérben futó** feladatot jelképez, **nincs felhasználói felülete** (pl. letöltés a háttérben). `android.app.Service`-ből öröklődik.
- Más komponens **elindíthatja**, vagy **csatlakozhat hozzá (bind)** vezérlés céljából (Remote Method / AIDL).

### c) Content Provider
- **Megosztott adatforrás** kezelése. Az adat lehet fájlrendszerben, SQLite-ban, weben vagy egyéb perzisztens tárban.
- Rajta keresztül **más alkalmazások is hozzáférhetnek / módosíthatják** az adatot (pl. CallLog). `android.content.ContentProvider`-ből származik, felül kell definiálni az API hívásokat. Lekérdezés eredménye: Cursor.

### d) Broadcast Receiver
- **Rendszer-szintű eseményekre (broadcast)** reagál (képernyő kikapcsolt, alacsony akku, bejövő hívás, elkészült fotó…). Alkalmazás is küldhet saját broadcastot.
- Nincs saját UI; jellemzően figyelmeztet (pl. status bar) vagy elindít egy másik komponenst (pl. service-t). `android.content.BroadcastReceiver`; az esemény **Intent** formájában érkezik.

## 2. Az .apk előállításának menete (fordítás)

```
Manifest + Erőforrások ──► Csomagolt erőforrások elkészítése ──► Csomagolt erőforrás fájlok
                                      │
                                      ▼
                                     R.java  ──┐
Forráskód + Könyvtárak ───────────► Fordító ───┴──► Dalvik bytecode előállítás ──► classes.dex
                                                                                       │
   Csomagolt erőforrás fájlok + classes.dex ──► APK készítése ──► Aláíratlan apk        │
                                                                        │ ◄─────────────┘
                                                          Kulcs ──► Apk aláírása ──► Aláírt apk
```

Lépésről lépésre:
1. A **Manifestből és az erőforrásokból** elkészülnek a **csomagolt erőforrások**, és generálódik az **R** (az erőforrás-azonosítók, `R.java`).
2. A **forráskódot** (az R-rel és a könyvtárakkal) a **fordító** lefordítja, majd **Dalvik bytecode** előállítás után **`classes.dex`** keletkezik (nem Java bytecode!).
3. A `classes.dex` + csomagolt erőforrások → **APK készítése** → **aláíratlan apk**.
4. **Aláírás egy kulccsal** → **aláírt apk** (ez telepíthető/terjeszthető).

### Az aláírt apk és tartalma
- Az .apk egy **tömörített állomány** (a Java `.jar`-hoz hasonló, de eltérésekkel). Tartalma:
  - **META-INF/**: `CERT.RSA` (alkalmazás **tanúsítvány**), `MANIFEST.MF` (meta infók kulcs-érték párokban), `CERT.SF` (az erőforrások listája és **SHA-1 hash**-ük).
  - **res/**: erőforrások.
  - **AndroidManifest.xml**: név, verzió, jogosultságok, könyvtárak.
  - **classes.dex**: a lefordított osztályok a VM számára.
  - **resources.arsc**.
- A telepítésért a **PackageManagerService** felelős (Play-ből vagy direkt apk-ból is).
- **Visszafejthető** (dex2Jar, JD-Gui), ezért a kód az apk-ban nincs biztonságban → érdemes **obfuszkálni**.

## 3. A Manifest állomány

- **Alkalmazás leíró**, **XML** állomány (`AndroidManifest.xml`), amely **definiálja az alkalmazás komponenseit**.
- A rendszer **komponens indítás előtt** és **telepítéskor** is ellenőrzi.
- **Amit feltétlenül tartalmaznia kell / tartalmaz**:
  - az alkalmazást tartalmazó **java package** – **egyedi azonosítóként** szolgál;
  - a kért **engedélyek (permissions)** (pl. internet, névjegyzék elérés);
  - a futtatáshoz szükséges **minimum API szint** (`<uses-sdk android:minSdkVersion="…"/>`);
  - használt **hardver/szoftver funkciók** (kamera, bluetooth…);
  - külső **API könyvtárak** (pl. Google Maps API);
  - az **alkalmazás komponensek listája**.
- Fontos attribútumok: `android:icon` (ikon), `android:name` (Activity teljes neve a package-dzsel), `android:label` (a felhasználónak látható név).
- Komponens tagek: **`<activity>`**, **`<service>`**, **`<provider>`** (Content Provider), **`<receiver>`** (Broadcast Receiver).
- **A manifestben nem szereplő Activity / Service / Content Provider nem látható a rendszer számára.** Kivétel a **Broadcast Receiver**, ami **kódból dinamikusan is regisztrálható** (`registerReceiver()`).
- **Belépési pont (launcher)**: az indító Activity `<intent-filter>`-ében az `android.intent.action.MAIN` action + `android.intent.category.LAUNCHER` category jelöli, hogy az app megjelenjen a futtatható alkalmazások listájában.

```xml
<manifest package="hu.bme.aut.android.examples" android:versionCode="1" android:versionName="1.0">
  <uses-sdk android:minSdkVersion="21" />
  <application android:icon="@drawable/ic_launcher" android:label="@string/app_name">
    <activity android:name=".MainActivity" android:label="@string/app_name">
      <intent-filter>
        <action android:name="android.intent.action.MAIN"/>
        <category android:name="android.intent.category.LAUNCHER"/>
      </intent-filter>
    </activity>
  </application>
</manifest>
```

---

### Kapcsolódó tételek
- Activity életciklus, Intent, Back Stack: [[tetel-12]].
- Erőforrás-kezelés, minősítők, lokalizáció: [[tetel-13]].
