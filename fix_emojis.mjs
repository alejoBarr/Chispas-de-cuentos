import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'constants.ts');
let content = fs.readFileSync(file, 'utf8');

const emojis = [
  // Nubi (4 links)
  { emoji: "🐇", bg: "#87CEEB" }, { emoji: "🧒", bg: "#B0E0E6" }, { emoji: "🍦", bg: "#ADD8E6" }, { emoji: "☀️", bg: "#87CEFA" },
  // Gaspard (5 links)
  { emoji: "👻", bg: "#9370DB" }, { emoji: "🐁", bg: "#8A2BE2" }, { emoji: "🐭", bg: "#7B68EE" }, { emoji: "🔮", bg: "#6A5ACD" }, { emoji: "✨", bg: "#483D8B" },
  // Finn (5 links)
  { emoji: "🦊", bg: "#98FB98" }, { emoji: "🌱", bg: "#90EE90" }, { emoji: "🌿", bg: "#8FBC8F" }, { emoji: "🧗", bg: "#3CB371" }, { emoji: "🏰", bg: "#2E8B57" },
  // Draco (5 links)
  { emoji: "🐉", bg: "#FFA07A" }, { emoji: "🦋", bg: "#FA8072" }, { emoji: "🌸", bg: "#E9967A" }, { emoji: "🐲", bg: "#F08080" }, { emoji: "⭐", bg: "#CD5C5C" },
  // Leo (5 links)
  { emoji: "🤖", bg: "#D3D3D3" }, { emoji: "🌲", bg: "#C0C0C0" }, { emoji: "🦉", bg: "#A9A9A9" }, { emoji: "🐻", bg: "#808080" }, { emoji: "💖", bg: "#778899" },
  // Coralia (5 links)
  { emoji: "🧜‍♀️", bg: "#AFEEEE" }, { emoji: "🎵", bg: "#E0FFFF" }, { emoji: "🐟", bg: "#00CED1" }, { emoji: "🪸", bg: "#48D1CC" }, { emoji: "🐠", bg: "#40E0D0" },
  // Pulpito (5 links)
  { emoji: "🐙", bg: "#FFB6C1" }, { emoji: "⏱️", bg: "#FFC0CB" }, { emoji: "🐚", bg: "#DB7093" }, { emoji: "🎨", bg: "#FF69B4" }, { emoji: "🎉", bg: "#FF1493" }
];

const getEmojiSvgUrl = (emoji, bgColor) => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="' + bgColor + '" /><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="400">' + emoji + '</text></svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

let matchCount = 0;
content = content.replace(/image:\s*["']data:image\/svg[^"']+["']/g, () => {
    if(matchCount < emojis.length) {
        const item = emojis[matchCount];
        matchCount++;
        return 'image: "' + getEmojiSvgUrl(item.emoji, item.bg) + '"';
    }
    return 'image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"';
});

fs.writeFileSync(file, content);
console.log("Replaced " + matchCount + " svg urls in constants.ts");
