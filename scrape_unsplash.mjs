import https from 'https';

function fetchHtml(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

const queries = [
    // Nubi
    "cute fluffy cloud painting", "happy children playing park cartoon", "ice cream cloud illustration", "happy cute sun painting",
    // Gaspard
    "cute friendly ghost illustration", "cute little mouse playing", "sad mouse cartoon", "glowing magic marble", "cute ghost holding mouse",
    // Finn
    "cute baby fox watercolor", "glowing magic seed", "giant rainbow beanstalk", "fox climbing tree illustration", "cloud castle bunny illustration",
    // Draco
    "cute small dragon illustration", "colorful butterfly cartoon", "falling flower wind", "dragon flying bravely", "happy dragon butterfly illustration",
    // Leo
    "cute small robot toy", "robot in sunny forest", "friendly owl drawing", "grizzly bear hugging", "happy robot with heart",
    // Coralia
    "beautiful mermaid illustration", "mermaid singing underwater", "sad gray fish", "glowing colorful coral reef", "happy colorful fish swimming",
    // Pulpito
    "cute curious octopus illustration", "old brass pocket watch", "hermit crab shell", "painting rainbow colors", "happy octopus celebrating under water"
];

async function run() {
    let results = [];
    for (let q of queries) {
        try {
            const html = await fetchHtml('https://unsplash.com/s/photos/' + encodeURIComponent(q));
            // Unsplash image URLs usually look like: images.unsplash.com/photo-15...
            const match = html.match(/images\.unsplash\.com\/photo-([a-zA-Z0-9\-]+)\?/);
            if (match && match[1]) {
                results.push('"' + match[1] + '"');
                console.log(q, "->", match[1]);
            } else {
                results.push('"1534447677768-be436bb09401"'); // fallback
                console.log(q, "-> FAIL");
            }
        } catch(e) {
            results.push('"1534447677768-be436bb09401"');
            console.log(q, "-> ERROR", e.message);
        }
    }
    console.log("FINAL ARRAY:");
    console.log(results.join(", "));
}

run();
