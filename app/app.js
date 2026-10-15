"use strict";
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { /* fall back below */ }
  const t = document.createElement("textarea");
  t.value = text;
  t.style.position = "fixed";
  t.style.opacity = "0";
  document.body.append(t);
  t.select();
  const ok = document.execCommand("copy");
  t.remove();
  return ok;
}

const $ = (id) => document.getElementById(id);
const SMALL = new Set("a an and as at but by for in nor of on or the to up via with".split(" "));
const words = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_\-.]+/g, " ").trim().split(/\s+/).filter(Boolean);
const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
const CASES = {
  "UPPER CASE": (s) => s.toUpperCase(),
  "lower case": (s) => s.toLowerCase(),
  "Sentence case": (s) => s.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-zà-ÿ])/g, (m, p, c) => p + c.toUpperCase()),
  "Title Case": (s) => s.toLowerCase().replace(/\S+/g, (w, i) => (i > 0 && SMALL.has(w) ? w : cap(w))),
  camelCase: (s) => words(s).map((w, i) => (i ? cap(w) : w.toLowerCase())).join(""),
  PascalCase: (s) => words(s).map(cap).join(""),
  snake_case: (s) => words(s).map((w) => w.toLowerCase()).join("_"),
  "kebab-case": (s) => words(s).map((w) => w.toLowerCase()).join("-"),
  CONSTANT_CASE: (s) => words(s).map((w) => w.toUpperCase()).join("_"),
  "aLtErNaTiNg": (s) => [...s].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join(""),
};
for (const [name, fn] of Object.entries(CASES)) {
  const b = document.createElement("button");
  b.textContent = name;
  b.addEventListener("click", () => { $("text").value = fn($("text").value); count(); });
  $("cases").append(b);
}
function count() { $("count").textContent = `${$("text").value.length} characters`; }
$("text").addEventListener("input", count);
$("copy").addEventListener("click", async () => { $("msg").textContent = (await copyText($("text").value)) ? "Copied." : "Couldn't copy; select the text instead."; });
$("clear").addEventListener("click", () => { $("text").value = ""; count(); $("text").focus(); });
count();
