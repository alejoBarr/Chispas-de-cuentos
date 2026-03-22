import fs from 'fs';
import path from 'path';
import https from 'https';

const STORY_IMAGES = [
  // Nubi
  { id: 'nubi_p2', url: 'https://image.pollinations.ai/prompt/A%20cute%20cartoon%20cloud%20transformed%20into%20a%20smiling%20rabbit.%20Blue%20sky.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'nubi_p3', url: 'https://image.pollinations.ai/prompt/Happy%20children%20in%20a%20green%20park%20waving%20at%20a%20cute%20cartoon%20rabbit%20cloud%20in%20the%20sky.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'nubi_p4', url: 'https://image.pollinations.ai/prompt/Three%20cute%20cartoon%20clouds%20shaped%20like%20ice%20cream%20sailboat%20lion.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'nubi_p5', url: 'https://image.pollinations.ai/prompt/A%20cute%20artist%20cloud%20floating%20happily%20surrounded%20by%20car%20star%20fish%20clouds.%20Smiling%20sun.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Gaspard
  { id: 'gaspard_p1', url: 'https://image.pollinations.ai/prompt/A%20cute%20translucent%20friendly%20cartoon%20ghost%20hiding%20shyly%20behind%20a%20curtain%20in%20a%20castle.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'gaspard_p2', url: 'https://image.pollinations.ai/prompt/A%20cute%20ghost%20watching%20a%20happy%20little%20mouse%20playing%20with%20a%20marble%20in%20a%20castle%20hall.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'gaspard_p3', url: 'https://image.pollinations.ai/prompt/A%20little%20sad%20cartoon%20mouse%20looking%20into%20a%20dark%20corner%20for%20a%20lost%20marble.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'gaspard_p4', url: 'https://image.pollinations.ai/prompt/A%20glowing%20marble%20rolling%20out%20of%20the%20dark.%20A%20cute%20ghost%20gently%20pushing%20it%20to%20a%20surprised%20mouse.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'gaspard_p5', url: 'https://image.pollinations.ai/prompt/A%20cute%20friendly%20ghost%20and%20a%20little%20mouse%20playing%20happily%20together%20with%20a%20floating%20marble.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Finn
  { id: 'finn_p1', url: 'https://image.pollinations.ai/prompt/A%20cute%20baby%20fox%20holding%20a%20glowing%20lantern%20in%20a%20magical%20forest%20of%20giant%20luminous%20mushrooms.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'finn_p2', url: 'https://image.pollinations.ai/prompt/A%20cute%20baby%20fox%20looking%20curiously%20at%20a%20small%20seed%20illuminated%20by%20a%20magic%20lantern.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'finn_p3', url: 'https://image.pollinations.ai/prompt/A%20giant%20glowing%20beanstalk%20with%20rainbow%20leaves%20growing%20fast.%20A%20cute%20amazed%20fox%20looking%20up.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'finn_p4', url: 'https://image.pollinations.ai/prompt/A%20cute%20brave%20fox%20climbing%20a%20giant%20rainbow%20beanstalk.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'finn_p5', url: 'https://image.pollinations.ai/prompt/A%20majestic%20cloud%20castle%20with%20cute%20star-patterned%20bunnies%20playing.%20A%20happy%20fox%20arrives.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Draco
  { id: 'draco_p1', url: 'https://image.pollinations.ai/prompt/A%20cute%20small%20dragon%20sitting%20scared%20on%20a%20cliff%20edge%20looking%20down.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'draco_p2', url: 'https://image.pollinations.ai/prompt/A%20cute%20small%20dragon%20talking%20to%20a%20friendly%20colorful%20butterfly.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'draco_p3', url: 'https://image.pollinations.ai/prompt/A%20beautiful%20flower%20falling%20from%20a%20cliff%20in%20the%20wind.%20A%20desperate%20butterfly%20looking.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'draco_p4', url: 'https://image.pollinations.ai/prompt/A%20brave%20cute%20small%20dragon%20diving%20off%20a%20cliff%20with%20spread%20wings.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'draco_p5', url: 'https://image.pollinations.ai/prompt/A%20happy%20cute%20small%20dragon%20flying%20holding%20a%20flower.%20A%20happy%20butterfly%20flying%20nearby.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Leo
  { id: 'leo_p1', url: 'https://image.pollinations.ai/prompt/A%20cute%20friendly%20small%20robot%20looking%20confused%20with%20a%20question%20mark%20in%20a%20lab.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'leo_p2', url: 'https://image.pollinations.ai/prompt/A%20cute%20friendly%20small%20robot%20walking%20out%20of%20a%20lab%20into%20a%20sunny%20forest.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'leo_p3', url: 'https://image.pollinations.ai/prompt/A%20wise%20friendly%20owl%20with%20glasses%20on%20a%20branch%20hugging%20a%20cute%20small%20robot.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'leo_p4', url: 'https://image.pollinations.ai/prompt/A%20big%20friendly%20brown%20bear%20giving%20a%20warm%20hug%20to%20a%20surprised%20cute%20small%20robot.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'leo_p5', url: 'https://image.pollinations.ai/prompt/A%20happy%20cute%20small%20robot%20with%20a%20glowing%20heart%20in%20its%20chest%20in%20a%20lab.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Coralia
  { id: 'coralia_p1', url: 'https://image.pollinations.ai/prompt/A%20beautiful%20smiling%20mermaid%20tending%20a%20vibrant%20colorful%20underwater%20coral%20garden.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'coralia_p2', url: 'https://image.pollinations.ai/prompt/A%20singing%20mermaid%20with%20musical%20notes.%20Glowing%20singing%20corals.%20Magical%20underwater%20scene.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'coralia_p3', url: 'https://image.pollinations.ai/prompt/A%20school%20of%20sad%20gray%20fish%20swimming%20past%20a%20vibrant%20mermaid%20coral%20garden.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'coralia_p4', url: 'https://image.pollinations.ai/prompt/A%20mermaid%20and%20glowing%20singing%20corals%20performing%20for%20curious%20sad%20gray%20fish.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'coralia_p5', url: 'https://image.pollinations.ai/prompt/Brightly%20colored%20happy%20fish%20swimming%20around%20a%20singing%20mermaid%20in%20a%20glowing%20coral%20garden.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Pulpito
  { id: 'pulpito_p1', url: 'https://image.pollinations.ai/prompt/A%20cute%20curious%20octopus%20with%20inventor%20goggles%20building%20a%20gadget%20in%20a%20coral%20cave.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'pulpito_p2', url: 'https://image.pollinations.ai/prompt/A%20thoughtful%20cute%20octopus%20holding%20an%20old%20brass%20pocket%20watch%20with%20idea%20bubbles.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'pulpito_p3', url: 'https://image.pollinations.ai/prompt/A%20group%20of%20sad%20hermit%20crabs%20with%20plain%20shells.%20A%20cute%20octopus%20with%20a%20lightbulb%20idea.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'pulpito_p4', url: 'https://image.pollinations.ai/prompt/A%20cute%20inventor%20octopus%20operating%20a%20coral%20machine%20painting%20rainbow%20colors%20on%20hermit%20crab%20shells.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  { id: 'pulpito_p5', url: 'https://image.pollinations.ai/prompt/A%20happy%20cute%20octopus%20celebrating%20with%20happy%20hermit%20crabs%20wearing%20brightly%20colored%20painted%20shells.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' },
  // Fallback
  { id: 'fallback_magic_book', url: 'https://image.pollinations.ai/prompt/A%20cute%20cartoon%20magical%20talking%20book%20with%20a%20happy%20smiling%20face%20and%20sparkles.%20Childrens%20book%20illustration%20style?width=800&height=800&nologo=true' }
];

const dir = path.join(process.cwd(), 'public', 'assets', 'stories');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                return downloadImage(res.headers.location, filepath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                reject(new Error("Failed to get " + url + " (" + res.statusCode + ")"));
                return;
            }
            const file = fs.createWriteStream(filepath);
            res.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
            file.on('error', (err) => {
                fs.unlink(filepath, () => reject(err));
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log("Starting download of " + STORY_IMAGES.length + " images...");
    for (let i = 0; i < STORY_IMAGES.length; i++) {
        const item = STORY_IMAGES[i];
        const filepath = path.join(dir, item.id + '.jpg');
        console.log("Downloading " + (i+1) + "/" + STORY_IMAGES.length + ": " + item.id + ".jpg");
        let retryCount = 0;
        let success = false;
        while (!success && retryCount < 3) {
            try {
                await downloadImage(item.url, filepath);
                success = true;
            } catch (e) {
                console.log("Error downloading, retrying...", e.message);
                retryCount++;
            }
        }
        if(!success) console.log("FAILED to download " + item.id);
    }
    console.log("Done!");
}

main();
