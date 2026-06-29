# Jegyzet – Android 04: RecyclerView, Persistence, Content Provider

## RecyclerView (listakezelés)
- **Listák hatékony kezelése**: gyors scrollozás, érintés-gesztusok (swipe, move), **ViewHolder minta** a gyors működéshez, hatékony elem-újrafelhasználás, flexibilis.
- **ViewHolder**: a `RecyclerView.ViewHolder`-ből származik, az egy sor (itemView) View-referenciáit tárolja (pl. tvName, btnEdit). **Előny**: statikus ViewHolder objektum, cache; **nincs folyamatos `findViewById`** → gyors.
- **RecyclerView.Adapter<ViewHolder>** kötelező metódusai:
  - **`onCreateViewHolder(parent, viewType)`**: egy sor nézetét hozza létre (`LayoutInflater...inflate(R.layout.row_item, parent, false)` → ViewHolder).
  - **`onBindViewHolder(holder, position)`**: a sor adatainak és eseménykezelőinek beállítása (binding).
  - **`getItemCount()`**: elemek száma. Hozzáadás/törlés: `notifyItemInserted` / `notifyItemRemoved`.
- **ListAdapter** (újabb): LiveData-kompatibilis; nem kell saját listát kezelni; **DiffUtil**-lal hasonlítja össze az elemeket az optimális újrarajzoláshoz; `getItemCount()` nem kell.
- **LayoutManagerek**: LinearLayout(Manager), StaggeredGrid, Grid.
- **Lista készítés lépései**: 1) data class, 2) egy sor layoutja, 3) RecyclerView (hova kerül), 4) Adapter (mi kerül bele).

## Perzisztens adattárolás – áttekintés
Androidon minden igényre van beépített megoldás:
- **SharedPreferences**: alaptípusok kulcs-érték párokban (DataStore váltja le).
- **Fájlkezelés**: privát (internal) és publikus (external/SD) lemezterület.
- **SQLite adatbázis**: strukturált adatokhoz.
- **Hálózat**: saját szerver vagy felhő (BaaS).

## SharedPreferences
- **Alaptípusok** (int, long, float, String, boolean) tárolása **kulcs-érték párként** (~Dictionary). **Fájlban** tárolódik (az OS elfedi), megőrzi tartalmát app/telefon újraindításkor is.
- Láthatóság létrehozáskor: **`MODE_PRIVATE`** (csak saját app), MODE_WORLD_READABLE/WRITABLE (elavult).
- Ideális primitív adatokhoz: default beállítások, UI-állapot, Settings adatai (innen a név). Több SP-fájl is lehet (név különbözteti): `getSharedPreferences(name, mode)`; ha egy Activity-hez elég egy: `getPreferences(mode)`.
- Olvasás: `sharedPref.getInt(KEY, default)`. Írás: `sharedPref.edit().putInt(KEY, 100).commit()`.

### Preferences Framework
- XML-alapú keretrendszer **saját Beállítások képernyő**hez (ugyanúgy néz ki, mint a rendszerszintű). Kell: 1) **XML** (`PreferenceScreen`, `PreferenceCategory`, `EditTextPreference`/`CheckBoxPreference`/`SwitchPreference`/`ListPreference`), 2) `PreferenceActivity` leszármazott Activity, 3) (opc.) `OnSharedPreferenceChangeListener`. **Csak SharedPreferences-szel** működik. Rendszer-beállító képernyők is integrálhatók `<intent>`-tel.

### JetPack DataStore
- SharedPreferences modernebb utódja; **Coroutine** + **Flow** (aszinkron, konzisztens, tranzakciós). Két implementáció: **Preferences DataStore** (kulcs alapú, séma nélkül), **Proto DataStore** (egyedi típus, séma protocol bufferrel). Ez is fájlban tárol (megőrzi újraindításkor).

## SQLite
- Az Android beépített, teljes értékű relációs adatbáziskezelő (≈MySQL); **strukturált adathoz a legjobb**. Alapból **nincs ORM** fölötte – nekünk kell a séma és a query-k (vagy külső ORM).
- Érdemes elsődleges kulcs; ContentProviderrel kiajánláshoz / Adapterrel feltöltéshez **kötelező egy `_id` nevű oszlop**.
- Oszloptípusok: **TEXT** (String), **INTEGER** (long), **REAL** (double) – a többit ezekre kell konvertálni; SQLite **nem ellenőrzi a típust** beíráskor. Van SQL szintaxis, tranzakció, prepared statement.
- Az SQLite-elérés **fájlrendszer-elérés → lassú lehet** → adatbázis-műveletet **aszinkron** (pl. külön Thread/AsyncTask/Loader) végezzünk.

## ORM és Room
- **ORM (Object-Relation Mapping)**: objektumok tárolása relációs DB-ben. Alapelvek: **osztálynév → tábla név**, **objektum → tábla egy sora**, **mező → tábla oszlopa**.
- **Room Persistence Library** (Google ORM-je): absztrakciós réteg az SQLite felett, a teljes SQLite-képességekkel. Architektúra: **Room Database** ↔ **DAO** ↔ **Entities** ↔ az app.
  - **@Entity** (`data class`, `@PrimaryKey(autoGenerate=true)`, `@ColumnInfo`).
  - **@Dao** (interface): `@Query("SELECT ...")`, `@Insert`, `@Delete`, `@Update`.
  - **@Database** (abstract `RoomDatabase`): `entities`, `version`; DAO getter; tipikus singleton `Room.databaseBuilder(...).build()`.
  - Használat háttérszálon (Thread), UI-frissítés `runOnUiThread`.

### Architecture Components / javasolt architektúra
- **Lifecycle/LifecycleObserver**, **LiveData** (megfigyelhető adat), **ViewModel** (UI-adat, konfig-változástól független), **Room**.
- Javasolt: Activity/Fragment → **ViewModel** (LiveData) → **Repository** → Model (Room/SQLite) / Remote Data Source (web). Perzisztencia az offline működéshez.

## Fájlkezelés
- Mint Java-ban, néhány Android-specialitással. **Két lemezterület**:
  - **Internal storage**: védett, **csak az app** éri el (user/más app nem).
  - **External storage** (~SD; lehet belső memóriában is): a felhasználó által is írható-olvasható.
- **Internal**: `openFileOutput(filename, mode)` (MODE_PRIVATE felülír, MODE_APPEND hozzáfűz; filename-ben nincs `\`); olvasás `openFileInput(filename)` → FileInputStream, `read()`, `close()`. **Cache**: `getCacheDir()` (kevés helynél a rendszer törli, max ~1MB ajánlott).
- **Statikus fájlok**: `res/raw` mappába; telepítéskor az internal storage-be kerülnek, **read-only**; olvasás `resources.openRawResource(R.raw.myfile)`.
- **External/nyilvános**: bárki írhatja-olvashatja; USB-storage módban csak olvasható az app-nak; bármikor elérhetetlenné válhat / a user törölheti. Elérhetőség: **`Environment.getExternalStorageState()`** (`MEDIA_MOUNTED`, `MEDIA_MOUNTED_READ_ONLY`...). Könyvtárak: `getExternalFilesDir(type)` (DIRECTORY_PICTURES, DCIM, MUSIC, DOWNLOADS…). **MediaScanner** indexel (kihagyás: `.nomedia` fájl). Engedély: **`WRITE_EXTERNAL_STORAGE`**.

## Adattárolás a felhőben (BaaS)
- Szerveroldal: saját implementáció (PHP/Java/.NET/Node, SaaS), vagy felhő: **PaaS** (saját kód cloudban – Heroku, Azure, Amazon), **BaaS** (Backend as a Service – kész háttérszolgáltatások: Firebase, Backendless, Kumulos).
- **BaaS képességek**: user-kezelés, perzisztencia/táblák/backup, offline, fájl, verzió, analytics, push, geolocation, social…
- **Hátrányok**: bizalom, **lock-in** (váltás nehéz), BaaS-specifikus UI, adatszuverenitás (EU vs USA), számlázás.
- **Firebase**: Realtime Database (JSON-alapú NoSQL, eseményvezérelt), Cloud Firestore, Authentication, Storage, Crash reporting, Analytics, Notifications.

## Content Provider
- **Motiváció**: az Intent Data / SharedPreferences / nyilvános fájlok egyike sem jó adatmegosztásra komponensek/appok között. Kell az adat/üzleti logika szétválasztás, "natív" adatok elérése (névjegy, naptár, SMS), saját adat kiajánlása.
- **Content Provider**: olyan mechanizmus, ami **elérési réteget biztosít strukturált adathoz**, **elfedi a tényleges tárolási módot**, **adatvédelmet** ad, és **processzek közti adatmegosztást** is megvalósít.
- **Adattárolás** módja az appra van bízva; kell: leszármazás az absztrakt **`ContentProvider`**-ből + kötelező metódusok. (Legegyszerűbb SQLite-tal, de nem kötelező.) Beépítve: média, naptár/névjegy/hívásnapló, beállítások, könyvjelzők, szótár…
- **Elérés**: **`ContentResolver`** (csak ez tudja lekérdezni; az IPC-t az Android átlátszóan intézi; egy Providerből **singleton** példány). Teljes **CRUD**:
  - **query()** → **Cursor** (eredményhalmaz), **insert()** → beszúrt elem **URI**-ja, **update()** → érintett sorok száma, **delete()** → törölt sorok száma.
- **CONTENT_URI**: `content://authority/path` – **`content://`** séma (jelzi, hogy Content URI), **authority** (globálisan egyedi Provider-azonosító, pl. `user_dictionary`), **path** (az adattábla – nem DB-tábla – neve, pl. `words`). Pl. `content://user_dictionary/words`.
- **Engedélyek**: a rendszer-Providerekhez általában user-engedély kell (pl. `READ_USER_DICTIONARY`); telepítéskor és futásidőben is kérni.
- **Cursor**: az egész eredményhalmazra mutat, **random access**, soronként feldolgozható (`moveToNext()`, `getColumnIndex`, `getString`), `getCount()`==0 ha nincs találat; hibánál null vagy kivétel.
- **insert/update/delete** paraméterei: CONTENT_URI, az értékek **`ContentValues`**-ban, szelekciós feltétel (`?` helyőrzőkkel) és értékei.
