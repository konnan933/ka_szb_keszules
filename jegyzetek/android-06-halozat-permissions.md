# Jegyzet – Android 06: NFC, Bluetooth, Http, Retrofit, BR, Service, Permissions

## Hálózati kommunikáció áttekintés
- **"Rövid" távú**: NFC, Nearby API, Bluetooth, WiFi Direct.
- **"Hosszabb távú" / internet**: TCP Socket, UDP, HTTP (REST).

## Rövidtávú kommunikáció
### NFC (Near Field Communication)
- Rövidtávú vezeték nélküli, **<4 cm**-en belül. Kis méretű adat (payload) NFC tag↔telefon vagy telefon↔telefon közt. Formátum: **NDEF** (NFC Data Exchange Format, az NFC Forum szabványa).
- **NFC tag**: írható/olvasható/egyszer írható; komplex tag tartalmazhat matematikai műveletet, kriptográfiai hardvert (authentikáció), vagy akár saját futási környezetet.
- **NFC Beam**: NDEF üzenet két Android közt, nincs felderítés, a kapcsolat automatikusan felépül hatótávon belül.
- Manifest: `uses-permission android.permission.NFC`, `uses-feature android.hardware.nfc`.

### Bluetooth és Nearby
- **Hagyományos BT**: készülék-felderítés, párosított eszközök lekérdezése, **RFCOMM** csatorna, service discovery, adattovábbítás, több kapcsolat. `android.bluetooth` csomag. Osztályok: **BluetoothAdapter** (felderítés, párosítás, server socket), **BluetoothDevice** (távoli eszköz), **BluetoothSocket/ServerSocket**, BluetoothClass, BluetoothProfile.
- **Bluetooth LE** (API 18-tól): central/peripheral; felderítés + kommunikáció (karakterisztikák); **lényegesen kisebb energiafogyasztás** (szenzorok, szívritmus, eü.).
- **Nearby API**: Nearby Messages (byte[] küldés/fogadás), Nearby Connections (P2P), Nearby Notifications (beacon).

## Internet alapú kommunikáció
### TCP/IP és UDP
- **TCP**: szabványos `java.net.Socket` (kapcsolat megnyitás), `java.net.ServerSocket` (bejövő kapcsolat); InputStream/OutputStream az adathoz. **Megbízható** kapcsolat.
- **UDP**: `java.net.DatagramSocket` + `DatagramPacket`; **gyors**, de **nem biztosítja a csomag megérkezését**; tipikusan valós idejű média, játékok. Broadcast: `setBroadcast(true)`.
- Könyvtár: **Kryonet** (TCP/UDP kliens-szerver, Kryo szerializáció, objektumok küldése).

### HTTP(s)
- Tipikus architektúra: a mobil **HTTP(S) GET/POST**-ot küld a backendnek, az lekérdezi a DB-t, és **JSON/CSV/XML** választ ad.
- Metódusok: **GET, POST, PUT, DELETE**; teljes HTTPS + tanúsítvány-import; **REST** támogatás.
- **Engedély: `INTERNET`**. **A hálózati hívást új szálban kell végezni!** Ellenőrizni a HTTP válaszkódot, alapos hibakezelés.
- URL felépítés: **host** + **path** + `?` + **params** (`q=Budapest&units=metric&appid=...`).
- **Könyvtárak**: beépített `HttpURLConnection` (Java), Apache `HttpClient` (**deprecated, kivették**) – egyik sem igazán jó → 3rd party **OkHttp**.
- `HttpURLConnection`: `url.openConnection() as HttpURLConnection`; GET-nél `inputStream` olvasása; POST-nál `requestMethod="POST"`, `doOutput=true`, `outputStream`. **Timeout**: `setConnectTimeout`, `setReadTimeout`.

### Aszinkron kommunikáció / UI más szálból
- Indításkor van egy **main (UI) szál**. Hosszú műveletet külön szálba kell tenni, **de a UI-t csak a fő szálból szabad módosítani**. Megoldások: `runOnUiThread`, `View.post`/`postDelayed`, `Handler`, AsyncTask/LocalBroadcast (deprecated), EventBus/Otto, **Retrofit**, **Coroutine**.

## Adatformátumok
- **CSV/TSV**, **XML** (beépített parser / SimpleXML), **JSON** (beépített / GSON / Moshi).
- **JSON**: kulcs-érték párok `{}`, tömb `[]`. Feldolgozás: **JSONObject** (`getString`/`getJSONObject`/`getJSONArray`), **JSONArray** (index, hossz). JSON → Kotlin **data class** (akár "JSON to Kotlin" plugin).
- **XML feldolgozás**: **SAX** (`SAXParser`, eseményvezérelt, a jelölőelemekhez érve generál eseményt) vagy **DOM** (`DocumentBuilder`, az egész XML fát memóriába olvassa, lekérdezhető).
- REST API teszt: **Postman**.

## Retrofit
- REST library, **OkHttp-re épül**. HTTP kérések **annotációkkal** leírva (URL/query param, body↔objektum konverzió JSON/protobuf, multipart/fájl).
- **Konverter**: GSON / KotlinX Serialization / Moshi (`addConverterFactory`).
- **Lépések**: 1) **entitások** (data class); 2) **API interfész** (`@GET("/latest") fun getRates(@Query("base") base: String): Call<MoneyResult>`); 3) **`Retrofit.Builder().baseUrl(...).addConverterFactory(...).build()`** + `retrofit.create(API::class.java)`; 4) hívás **`call.enqueue(Callback)`** (aszinkron: `onResponse`/`onFailure`). A JSON→objektum konverziót **automatikusan** végzi.

## Broadcast Receiver
- **Rendszer-szintű eseményekre** lehet feliratkozni – Broadcast üzenet; az eseményt **Intent** írja le. Sok beépített action: `ACTION_BOOT_COMPLETED`, `ACTION_BATTERY_CHANGED`, `ACTION_POWER_CONNECTED`, `ACTION_TIME_TICK`, `SMS_RECEIVED`… (lehet egyedi is).
- **Appok (Activity/Service) is dobhatnak** broadcastot: `sendBroadcast(action)` (Intent, lehet Extra/Data).
- **Elkapás**: **`BroadcastReceiver`**-ből származunk, felüldefiniáljuk az **`onReceive(context, intent)`**-et. **Regisztráció**: **statikusan** (Manifest `<receiver>` + `<intent-filter>`) vagy **dinamikusan** (kódból `registerReceiver`/`unregisterReceiver`, pl. onStart/onStop). Az **intent-filter** szabja meg, milyen Intentre aktiválódjon. Bizonyos actionöknél (pl. TIME_TICK) csak dinamikus megy.
- Nincs UI-ja, de **indíthat Activity-t**. `abortBroadcast()` megakadályozza a továbbdobást (ordered broadcastnál). **Boot utáni indítás**: `BOOT_COMPLETED` receiver a Manifestben, az `onReceive`-ben indítjuk a komponenst.

## Service
- **Háttérben futó**, **UI nélküli**, hosszú feladat (hálózat, monitorozás, zene, feltöltés). Felhasználói beavatkozás nélkül; más komponens **Intenttel** indítja; akkor is futhat, ha a hívó leáll. Más appból is elérhető (de letiltható → **privát** service Manifest-attribútummal). Minden Service nagy felelősség (leállítás, erőforrás!).
- **Két működési mód**:
  - **Started/Unbound**: `startService(intent)`; akkor is fut, ha a hívó megsemmisült; **egy feladatot** hajt végre; **magát kell leállítania** `stopSelf()`-fel (vagy a hívó `stopService()`-szel) – az OS nem teszi meg. (Started: IntentService.)
  - **Bound**: nem "kézzel", hanem **kapcsolódáskor** indul; addig fut, amíg van kliens; **többen is kapcsolódhatnak**; folyamatos feladat; **nem kell leállítani** (az Android intézi). Minden rendszerszolgáltatás ilyen. (Bound: IBinder/Messenger/AIDL.)
  - Egy Service **mindkettőt** támogathatja (pl. zenelejátszó: startService-szel indul, de bound-dal lehet utasítani számváltásra).
- **Életciklus**: started → `onCreate` → **`onStartCommand`** → fut → `onDestroy`. bound → `onCreate` → **`onBind`** → kliensek → `onUnbind` → `onDestroy`.
- **Készítés**: `android.app.Service`-ből származunk, callbackek (`onStartCommand` / `onBind`), regisztráció a **Manifestben**.
- **FONTOS**: a Service **a folyamat fő szálában fut, nem kap külön szálat!** Erőforrás-igényes művelethez kézzel kell szálat indítani, különben ~5 mp után **ANR**. Android 8-tól a háttér-service-ek **erősen korlátozottak** (a rendszer leállíthatja).

## Futási idejű engedélyek (Runtime permissions)
- Veszélyes/kritikus/személyes adatot érintő művelethez **felhasználói engedély** kell. Régen: Manifest `<uses-permission>` + telepítéskor minden egyszerre. **Android 6 óta**: a **veszélyes** engedélyeket **futásidőben** kell kérni.
- **Típusok**: **normál** (automatikusan megkapja az app a Manifest alapján) és **veszélyes** (kódból kérni kell). A user a beállításokban visszavonhatja.
- **Folyamat** (Activity):
  1. **Ellenőrzés**: `ContextCompat.checkSelfPermission(...)` == `PERMISSION_GRANTED`?
  2. (opc.) **Indoklás**: `shouldShowRequestPermissionRationale(...)` → magyarázat a usernek.
  3. **Kérés**: `ActivityCompat.requestPermissions(this, arrayOf(...), REQUEST_CODE)`.
  4. **Eredmény**: `onRequestPermissionsResult(requestCode, permissions, grantResults)` – engedélyezés/tiltás kezelése.
- Külső libek: PermissionsDispatcher, Dexter, MayI… **Compose**: `rememberLauncherForActivityResult`, vagy Accompanist `rememberPermissionState` (`isGranted`, `shouldShowRationale`, `launchPermissionRequest()`).
- **Best practice**: rendszer beépített szolgáltatásait használni; csak a szükséges engedélyt; csak amikor kell; indokolni; mindkét modellt tesztelni.
