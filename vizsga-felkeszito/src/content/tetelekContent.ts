import { marked } from "marked";

// A 16 tétel teljes kidolgozása (.md) build-time-ban, nyers szövegként betöltve.
// Így a megjelenített tartalom SZÓ SZERINT az md fájl – semmi nem vész el.
const rawFiles = import.meta.glob("./tetelek/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Fájlnévből (tetel-07.md) tétel-azonosító kinyerése.
function idFromPath(path: string): number {
  const m = path.match(/tetel-(\d+)\.md$/);
  return m ? parseInt(m[1], 10) : -1;
}

// id -> nyers md tartalom
const RAW_BY_ID: Record<number, string> = {};
for (const [path, content] of Object.entries(rawFiles)) {
  const id = idFromPath(path);
  if (id > 0) RAW_BY_ID[id] = content;
}

// marked beállítás: GitHub-flavored markdown (táblázatok, kódblokkok).
marked.setOptions({ gfm: true, breaks: false });

// A [[tetel-09]] wikilinkeket kattintható hivatkozássá alakítjuk, mielőtt
// a marked feldolgozná (különben a [[...]] nyersen jelenne meg).
function transformWikilinks(md: string): string {
  return md.replace(/\[\[tetel-(\d+)\]\]/g, (_, num: string) => {
    const n = parseInt(num, 10);
    return `<a href="#" class="wikilink" data-tetel="${n}">${n}. tétel</a>`;
  });
}

/** A megadott tétel nyers md tartalma (vagy üres string, ha nincs). */
export function getRawMarkdown(id: number): string {
  return RAW_BY_ID[id] ?? "";
}

/** A megadott tétel kidolgozása HTML-ként renderelve. */
export function getRenderedMarkdown(id: number): string {
  const raw = RAW_BY_ID[id];
  if (!raw) return "";
  return marked.parse(transformWikilinks(raw)) as string;
}

/** Van-e betöltött md tartalom az adott tételhez. */
export function hasMarkdown(id: number): boolean {
  return Boolean(RAW_BY_ID[id]);
}
