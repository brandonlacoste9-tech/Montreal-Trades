import fs from "fs";
const s = fs.readFileSync("src/lib/i18n.ts", "utf8");
const m = s.match(/tagline: "([^"]+)"/);
console.log("tagline:", m?.[1]);
if (m?.[1]) {
  console.log(
    [...m[1]].map((c) => `${c} U+${c.codePointAt(0).toString(16)}`).join(" | ")
  );
}
const hasBroken = s.includes("�");
console.log("has replacement char:", hasBroken);
