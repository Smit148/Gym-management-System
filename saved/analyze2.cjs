const fs = require('fs');

const extract = (file) => {
  try {
    const html = fs.readFileSync(file, 'utf8');
    const regex = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
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

let allTexts = [];
const add = (arr) => arr.forEach(item => {
  if (item.text.length > 30 && item.href.includes('instagram.com')) {
    allTexts.push(`--- URL: ${item.href} ---\n${item.text}\n`);
  }
});

add(collections);
add(posts);

fs.writeFileSync('./saved/all_captions.txt', allTexts.join('\n'), 'utf8');
console.log('Wrote to all_captions.txt');
