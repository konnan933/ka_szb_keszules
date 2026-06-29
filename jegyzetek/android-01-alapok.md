# Jegyzet – Android 01: Bevezetés, alapok, Manifest

## Mobil platformok (történelem)
- **Symbian OS**: kifejezetten mobilra, erőforrásszegény készülékekre, magas rendelkezésre állás; csak alap, ráépül egy UI platform. Fejlesztés: C, C++, Qt, Java ME, Python.
- **Java ME** (Java Mobile Edition): a fordító **object code**-ot (nem gépi kód) készít, amit a készüléken futó **JVM interpretál**. Eltérő készülékekhez **konfigurációk** (VM + alacsony szintű API-k), ezekre épülnek a **profilok** (magasabb szintű API-k).
- **Windows Mobile** (Windows CE alapú) / **Windows Phone** (live tile-ok; Silverlight C#/VB vagy natív C++) / **Windows 10 Mobile** (asztali+mobil egyesülés, UWP).
- **Meego/Tizen**: Linux alapú; Tizen fejlesztés: natív C/C++/Python/Lua, HTML5+JS, .NET, Android appok (módosított Dalvik VM).
- **iOS** (eredetileg iPhone OS): exkluzívan Apple hardverre; OS X-szel közös alap (Core Foundation), speciális UI (Cocoa Touch); fejlesztés Objective-C, Swift; XCode.

## Android – mi ez?
- Egyrészt **operációs rendszer** (nem csak telefonra!), másrészt az ezt futtató eszközök összessége. Részben/egészében a **Google** fejlesztése.
- Történet: 2005 – Android Inc. felvásárlás; 2007.11.05 – **Open Handset Alliance** bejelenti a platformot; 2008 vége – első készülék (HTC G1, T-Mobile).
- **Google célja**: nyílt forráskódú, rugalmas, könnyen alakítható rendszer, amelyre könnyű külsős appot fejleszteni (a külsős szoftverek is hozzáférnek az erőforrások jelentős részéhez). **Moduláris Linux kernel alapú**; a kód túlnyomó része Apache/szabad licenc alatt.
- Eszközök: telefon, tablet, autó fedélzeti rendszer, Android Wear, ipari automatizálás, Google TV, edzőgép stb. (nem csak okostelefon!).
- **Verziók**: édesség kódnevek (Cupcake, Donut, …, Tiramisu, Vanilla Ice Cream, Baklava). Verziók közt komoly API-különbség lehet, törekednek visszafelé kompatibilitásra; fontos a **minimum támogatott verzió** átgondolása.

## Platform szerkezete (rétegek, alulról felfelé)
1. **Linux Kernel** + driverek (Audio, **Binder (IPC)**, Display, Bluetooth, Camera, WIFI, Power Management…).
2. **Hardware Abstraction Layer (HAL)**.
3. **Native C/C++ Libraries** (Webkit, OpenGL ES, Media Framework, Libc…) és **Android Runtime**.
   - **ART (Android RunTime)** a virtuális gép; régebben **DVM (Dalvik Virtual Machine)**.
4. **Java API Framework** (Managerek: Activity, Location, Package, Notification, Resource, Telephony, Window; Content Providers, View System).
5. **System Apps** (Dialer, Email, Calendar, Camera…).

## Fejlesztőeszközök
- **Android SDK**: fejlesztő eszközök, emulátor kezelő (AVD Manager), Java/Kotlin. Felépítés: add-ons/, docs/, platform-tools/ (adb), platforms/, samples/, tools/ (emulátor, ddms), SDK/AVD Manager.
- **Android NDK** (Native Development Kit): natív kód, C++.
- **Android ADK** (Accessory Development Kit): kiegészítő eszközök (Android Open Accessory protocol, USB és Bluetooth).
- **Android Studio**: IntelliJ IDEA alapú IDE (2013-tól), Windows/OSX/Linux. **Emulátor**: teljes OS emulálása (lassú).
- **Debugolás**: on-device debug támogatott (USB driver + USB debug engedély). Minden app **önálló process**, saját **VM**, egyedi portot nyit (8600, 8601…); a "base port" (8700) minden VM-et figyel.

## Első alkalmazás
- `class extends AppCompatActivity` (vagy `Activity`), `onCreate(Bundle)` felülírása, `super.onCreate(...)`, `setContentView(...)`.
- UI vagy kódból (`new TextView(this)`), vagy **XML layoutból** (`setContentView(R.layout.activity_main)`), és `findViewById(R.id.tvHello)`.
- **Eseménykezelés**: `setOnClickListener` (Java: anonim `OnClickListener`; Kotlin: lambda). Függvény-referencia (`::click`), vagy layoutban `android:onClick="click"`.

## Android alkalmazás komponensek (NÉGY)
1. **Activity** – különálló nézet saját UI-jal. Önállóan/más appból is indítható (pl. kamera app indítja az "új ToDo" Activity-t). `android.app.Activity`-ből származik.
2. **Service** – hosszan, **háttérben** futó feladat, **nincs UI-ja** (pl. letöltés). Más komponens indíthatja vagy **bind**-elhet hozzá. `android.app.Service`.
3. **Content Provider** – **megosztott adatforrás** kezelése (fájl, SQLite, web…). Más appok is hozzáférhetnek/módosíthatnak (pl. CallLog). `android.content.ContentProvider`.
4. **Broadcast Receiver** – rendszer-szintű **eseményekre (broadcast)** reagál (képernyő ki, alacsony akku, bejövő hívás…). App is küldhet saját broadcastot. Nincs UI; jelezhet pl. a status barra vagy indíthat komponenst. `android.content.BroadcastReceiver`; az esemény **Intent** formájában.
- Minden komponens **önállóan aktiválódhat**, akár másik app is aktiválhatja.

## Manifest állomány (AndroidManifest.xml)
- **Alkalmazás leíró**, XML; definiálja az alkalmazás **komponenseit**. Komponens indítás előtt és telepítéskor a rendszer ellenőrzi.
- Tartalma: **java package** (egyedi azonosító), kért **engedélyek** (internet, névjegyzék…), **minimum API szint** (`uses-sdk minSdkVersion`), **hardver/szoftver funkciók** (kamera, bluetooth…), külső API könyvtárak (Google Maps).
- Attribútumok/tagek: `android:icon`, `android:name` (Activity teljes neve), `android:label` (felhasználónak látható név). Komponens tagek: `<activity>`, `<service>`, `<provider>`, `<receiver>`.
- **A manifestben nem szereplő Activity/Service/Content Provider nem látható a rendszernek.** A **Broadcast Receiver** viszont dinamikusan is **regisztrálható kódból** (`registerReceiver()`).
- **Belépési pont** (launcher): az Activity `<intent-filter>`-ében `action.MAIN` + `category.LAUNCHER` → megjelenik a futtatható appok listájában.

## Erőforrások (resources)
- Az app nem csak forráskód: képek, hangok, ikonok, szövegek, és XML felületek (layout, animáció, menü, stílus, szín).
- Minden erőforráshoz a rendszer **egyedi azonosítót** generál (pl. `res/drawable/logo.png` → `R.drawable.logo`), ezeket az **`R.java`** tárolja (soha ne módosítsuk!).
- **Minősítők (qualifiers)**: a könyvtárnév után írhatók (akár több is), a készülék képességéhez igazítják az erőforrást. Pl. többnyelvűség: `res/values/`, `res/values-fr/`, `res/values-hu/` (strings.xml).

## Fordítás (forrás → .apk)
- Manifest + erőforrások → **csomagolt erőforrások** + **R** generálása.
- Forráskód + R + könyvtárak → **fordító** → **Dalvik bytecode előállítás** → **classes.dex**.
- classes.dex + csomagolt erőforrások → **APK készítése** → **aláíratlan apk** → **aláírás** (kulccsal) → **aláírt apk**.
- A kód tehát **Dalvik bytecode**-ra fordul (nem Java bytecode).

## Telepítés és .apk
- Play-ből **.apk** (vagy App Bundle); a telepítésért a **PackageManagerService** felelős (direkt letöltésnél is). Telepíthető belső memóriába vagy (feltételekkel) SD-re.
- **.apk** = tömörített állomány (jar-szerű). Tartalom: **META-INF/** (CERT.RSA tanúsítvány, MANIFEST.MF, CERT.SF – erőforrások SHA-1 hashei), **res/**, **AndroidManifest.xml**, **classes.dex** (lefordított osztályok a VM-nek), **resources.arsc**.
- **Visszafejtés**: MyBackup (apk megszerzés) → dex2Jar → JD-Gui → emiatt érdemes **obfuszkálni** (a kód az apk-ban nincs biztonságban).
