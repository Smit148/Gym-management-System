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

const posts = extract('./saved/saved_posts.html');

const keywords = ['react', 'vue', 'javascript', 'typescript', 'css', 'html', 'ui', 'ux', 'design', 'security', 'cyber', 'prompt', 'ai', 'agent', 'tool', 'extension', 'plugin', 'seo', 'developer', 'coding', 'code', 'saas', 'startup', 'performance', 'speed', 'cache', 'database', 'backend', 'frontend', 'senior'];

const matches = [];

posts.forEach(p => {
  if (!p.text) return;
  const textLower = p.text.toLowerCase();
  
  // Exclude extremely short generic IG texts
  if (p.text.length < 20) return;

  const matchedKeywords = keywords.filter(k => textLower.includes(k));
  if (matchedKeywords.length > 0) {
    matches.push({
      text: p.text,
      link: p.href,
      keywords: matchedKeywords
    });
  }
});

// Remove duplicates based on text
const uniqueMatches = [];
const seenTexts = new Set();
for (const m of matches) {
  if (!seenTexts.has(m.text)) {
    seenTexts.add(m.text);
    uniqueMatches.push(m);
  }
}

fs.writeFileSync('./saved/tech_insights.md', '# Tech & Dev Insights Extracted\n\n' + uniqueMatches.map(m => `### Keywords: ${m.keywords.join(', ')}\n${m.text}\n[Link](${m.link})\n`).join('\n---\n'), 'utf8');
console.log(`Extracted ${uniqueMatches.length} tech-related posts to saved/tech_insights.md`);
