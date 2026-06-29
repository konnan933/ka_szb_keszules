# 15. tétel – Hálózati kommunikáció mobilon, UI értesítése, engedélykezelés

> Milyen hálózati kommunikációs technológiákat ismer mobil környezetben? Mikre kell figyelni általánosságban a hálózati kommunikáció megvalósítása során mobil alkalmazás esetén? Hogyan értesíthető a felhasználói felület a lekérdezés eredménye esetén? Ismertesse az engedély kezelést Android platformon! Milyen engedély kategóriákat különböztetünk meg? Milyen módon kell kezelni az egyes engedélyeket?

*(Forrás: Android 06 – NFC, Bluetooth, Http, Retrofit, BR, Service, Permissions)*

---

## 1. Hálózati kommunikációs technológiák mobil környezetben

Két nagy csoport:

### a) "Rövid" távú kommunikáció
- **NFC** (Near Field Communication): rövidtávú vezeték nélküli, **<4 cm**-en belül, kis méretű adat (payload). NFC tag↔telefon vagy telefon↔telefon. Formátum: **NDEF**. (NFC Beam: NDEF küldés két Android közt, automatikus kapcsolat, nincs felderítés.)
- **Bluetooth**: készülék-felderítés, párosított eszközök, **RFCOMM** csatorna, service discovery, adattovábbítás (`android.bluetooth`: BluetoothAdapter, BluetoothDevice, BluetoothSocket…).
- **Bluetooth LE** (Low Energy, API 18-tól): lényegesen kisebb energiafogyasztás, szenzorokhoz (szívritmus, közelség, eü.).
- **Nearby API** (Messages, Connections P2P, Notifications), **WiFi Direct**.

### b) "Hosszabb" távú / internet alapú kommunikáció
- **TCP/IP Socket**: megbízható kapcsolat; `java.net.Socket` (kapcsolat megnyitás), `java.net.ServerSocket` (bejövő kapcsolat); InputStream/OutputStream.
- **UDP**: gyors, de **nem garantálja a csomag megérkezését** (valós idejű média, játékok); `DatagramSocket` + `DatagramPacket`.
- **HTTP(S)**: a leggyakoribb. Metódusok **GET, POST, PUT, DELETE**; teljes HTTPS + tanúsítvány; **REST** (Representational State Transfer). Könyvtárak: beépített `HttpURLConnection`, Apache `HttpClient` (deprecated), ajánlott 3rd party **OkHttp**, illetve **Retrofit** (OkHttp-re épül).

### TCP vs UDP különbség
- **TCP**: kapcsolat-orientált, **megbízható** (garantálja a csomag megérkezését, sorrendhelyes), de lassabb.
- **UDP**: kapcsolatmentes, **gyors**, de nem garantálja a kézbesítést/sorrendet – ott jó, ahol a csomagvesztés nem kritikus.

## 2. Mire kell figyelni a hálózati kommunikációnál (általánosságban)

- **Engedély**: a webes eléréshez kell a **`INTERNET`** permission (`<uses-permission android:name="android.permission.INTERNET"/>`).
- **NE a UI (fő) szálon!** A hálózati hívást **külön szálban** kell végezni, különben blokkolja a felületet, és ~5 mp után **ANR** (Application Not Responding).
- **HTTP válaszkód ellenőrzése** és **alapos hibakezelés** (try/catch, a stream/kapcsolat lezárása `finally`-ben).
- **Timeout** beállítása: `setConnectTimeout` (kapcsolat megnyitás) és `setReadTimeout` (eredmény olvasás) – ne fagyjon be a kérés.
- A választ tipikus formátumban kapjuk (**JSON**, CSV/TSV, XML) – ezt fel kell dolgozni (JSONObject/JSONArray, GSON/Moshi; XML: SAX vagy DOM).

## 3. A felhasználói felület értesítése az eredményről

Mivel a hálózati hívás külön szálon fut, de **a UI-t csak a fő (main) szálból szabad módosítani**, a háttérszálról vissza kell jelezni a UI-nak. Lehetőségek:
- **`Activity.runOnUiThread(Runnable)`** – a Runnable a UI szálon fut.
- **`View.post(Runnable)`** / **`View.postDelayed(Runnable, long)`**.
- **`Handler`** (üzenet a main loopernek).
- **AsyncTask** / **LocalBroadcast** – ma már deprecated.
- Külső event-bus könyvtárak (EventBus, Otto).
- **Retrofit**: a `Callback` `onResponse`/`onFailure` metódusa visszahívás, amelyben frissíthetjük a UI-t.
- **Kotlin Coroutine** (a modern megoldás): a háttérmunka után `Dispatchers.Main`-en frissítünk.

Példa (Retrofit): a `call.enqueue(...)`-ban az `onResponse`-ban `tvResult.text = response.body()?...` formában frissítjük a felületet.

## 4. Engedélykezelés Android platformon

- **Mire?** Veszélyes/kritikus/személyes adatot érintő művelethez **felhasználói engedély** szükséges (pl. kamera, helyzet, névjegyzék, külső tár).
- **Régi modell**: a Manifestben `<uses-permission ...>`, és az **összes engedélyt egyszerre, telepítéskor** kérte el a rendszer.
- **Új modell (Android 6 / API 23 óta)**: a **veszélyes** engedélyeket **futásidőben** kell elkérni, amikor szükség van rájuk (a user akkor lát rá kontextust, és egyenként engedélyez/tilt).

### Engedély kategóriák
- **Normál (normal) engedélyek**: kis kockázat; a rendszer **automatikusan megadja** a Manifestben felsoroltakat (nem kell külön kérni). Pl. INTERNET.
- **Veszélyes (dangerous) engedélyek**: érzékeny adat/művelet; ezeket **futásidőben, kódból kell kérni** a felhasználótól (pl. CAMERA, WRITE_CALENDAR, fine location). A felhasználó a **beállításokban bármikor visszavonhatja**.
- (A Manifestben mindkettőt érdemes felsorolni; a különbség a kérés módjában van.)

### A veszélyes engedélyek kérésének fázisai (Activity)
1. **Manifest-regisztráció** (`<uses-permission>`).
2. **Ellenőrzés**, hogy megvan-e már: `ContextCompat.checkSelfPermission(this, Manifest.permission.X) == PackageManager.PERMISSION_GRANTED`.
3. **Indoklás (opcionális)**: ha korábban elutasította, `ActivityCompat.shouldShowRequestPermissionRationale(...)` true – ekkor magyarázzuk el a usernek, miért kell.
4. **Kérés**: `ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.X), REQUEST_CODE)`.
5. **Eredmény kezelése**: a `onRequestPermissionsResult(requestCode, permissions, grantResults)` callbackben a `requestCode` és a `grantResults[0] == PERMISSION_GRANTED` alapján kezeljük az **engedélyezés / tiltás** esetet.

```kotlin
if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
        != PackageManager.PERMISSION_GRANTED) {
    if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.CAMERA)) {
        // magyarázat a felhasználónak, miért kell
    }
    ActivityCompat.requestPermissions(this,
        arrayOf(Manifest.permission.CAMERA), PERMISSION_REQUEST_CODE)
} else {
    // már van engedély
}

override fun onRequestPermissionsResult(requestCode: Int,
        permissions: Array<String>, grantResults: IntArray) {
    if (requestCode == PERMISSION_REQUEST_CODE &&
        grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
        // engedélyezve
    } else {
        // megtagadva
    }
}
```

- **Külső libek**: PermissionsDispatcher, Dexter, MayI. **Compose**: `rememberLauncherForActivityResult`, vagy Accompanist `rememberPermissionState` (`status.isGranted`, `shouldShowRationale`, `launchPermissionRequest()`).
- **Best practice**: lehetőleg a rendszer beépített szolgáltatásait használjuk; csak a szükséges engedélyt kérjük; csak akkor, amikor kell; indokoljuk; mindkét modellt (Manifest + kód) teszteljük régi és új Android-on.

---

### Kapcsolódó tételek
- Android komponensek (Service, Broadcast Receiver, Intent): [[tetel-11]], [[tetel-12]].
- Perzisztens adattárolás, felhő (BaaS): [[tetel-14]].
- Aszinkron / Promise (JS oldalról a párhuzam): [[tetel-04]].
