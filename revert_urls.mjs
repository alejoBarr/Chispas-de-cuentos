import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'constants.ts');
let content = fs.readFileSync(file, 'utf8');

const unsplashIds = [
  // Nubi
  "1596333522244-2453664c3986", "1471086569966-db3eebc25a59", "1513151233558-d860c5398176", "1506744038136-46273834b3fb",
  // Gaspard
  "1533035353720-f1c6a75cd8ab", "1549488344-1f9b8d2bd1f3", "1518717758536-85ae29035b6d", "1614088636458-132d43e5c70a", "1522075469751-3a6694fb2f61",
  // Finn
  "1516934824317-ba9688b1b3fb", "1444464666168-49b626d49c8f", "1464822759023-fed622ff2c3b", "1542385262-bfa7fb104273", "1509114397022-ed747cca3f65",
  // Draco
  "1549480017-d51381e4b86c", "1555580662-7fa6bc06429f", "1490750967868-88cb44cb2722", "1465225314224-587fc8cb5c5d", "1510936111840-65e151ad71bb",
  // Leo
  "1485827404703-89b55fcc595e", "1542601906990-b4d3fb778b09", "1543330364-be5791c8ee9e", "1550977284-adbbc98db519", "1534447677768-be436bb09401",
  // Coralia
  "1546026423-cc46426ba651", "1582967788606-a171c1080cb0", "1551024709-8f23befc6f87", "1544527962-d92e5926ec03", "1504280529881-3e4b0c79cd36",
  // Pulpito
  "1545671598-14609f4a13ad", "1509048191080-d2984bad6ae5", "1559400049-373562681534", "1498084393753-b411b2d26b34", "1503614472-8c93d56e92ce"
];

let matchCount = 0;
content = content.replace(/https:\/\/image\.pollinations\.ai\/prompt\/[^"']+/g, () => {
  const id = unsplashIds[matchCount];
  matchCount++;
  return "https://images.unsplash.com/photo-" + id + "?q=80&w=800&auto=format&fit=crop";
});

fs.writeFileSync(file, content);
console.log("Replaced " + matchCount + " urls in constants.ts");

const geminiFile = path.join(process.cwd(), 'services', 'geminiService.ts');
let geminiContent = fs.readFileSync(geminiFile, 'utf8');
geminiContent = geminiContent.replace(/https:\/\/image\.pollinations\.ai\/prompt\/[^"']+/g, "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop");
fs.writeFileSync(geminiFile, geminiContent);
console.log("Reverted geminiService.ts");
