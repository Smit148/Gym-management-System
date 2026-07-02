const fs = require('fs');

const extract = (file) => {
  try {
    const html = fs.readFileSync(file, 'utf8');
    const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi;
    let match;
    const links = [];
    while ((match = regex.exec(html)) !== null) {
      let text = match[2].replace(/<[^>]+>/g, '').trim();
      links.push({ href: match[1], text });
    }
    return links;
  } catch (e) {
    console.error('Error reading', file, e);
    return [];
  }
};

const collections = extract('./saved/saved_collections.html');
const posts = extract('./saved/saved_posts.html');

console.log('--- ALL COLLECTIONS ---');
collections.forEach(l => {
  if (l.text) console.log(`- ${l.text}`);
});

console.log('\n--- ALL POSTS ---');
posts.forEach(l => {
  if (l.text && l.href.includes('instagram.com')) console.log(`- ${l.text}`);
});
