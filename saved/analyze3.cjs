const fs = require('fs');

const allText = fs.readFileSync('./saved/all_captions.txt', 'utf8');
const sections = allText.split('--- URL: ');

const categories = {
  'Senior / Code Review Plugins': ['senior', 'doctor', 'review', 'plugin', 'extension', 'mcp'],
  'UX / UI / Design': ['ux', 'ui', 'premium', 'spinner', 'skeleton', 'hierarchy', 'spacing', 'design'],
  'AI Agents / Workflows': ['agent', 'opik', 'vibecoding', 'claude', 'chatgpt', 'check everything', 'prompt', 'prove'],
  'Performance / Architecture': ['debounce', 'throttle', 'caching', 'server overload', 'cache'],
  'Cyber Security': ['security', 'rate limit', 'sanitize', 'audit', 'vulnerability', 'hardcoded'],
  'Tools / Repos': ['nango', 'repo', 'open source', 'github'],
  'SEO / Growth': ['seo', 'gmb everywhere']
};

const categorized = {};
Object.keys(categories).forEach(k => categorized[k] = []);

sections.forEach(s => {
  if (!s.trim()) return;
  const lines = s.split('\n');
  const url = lines.shift().trim().replace(' ---', '');
  const text = lines.join('\n').trim();
  const lower = text.toLowerCase();
  
  Object.keys(categories).forEach(cat => {
    if (categories[cat].some(keyword => lower.includes(keyword))) {
      categorized[cat].push(text);
    }
  });
});

let output = '';
Object.keys(categorized).forEach(cat => {
  if (categorized[cat].length > 0) {
    output += `\n\n### [${cat}] ###\n\n`;
    // Dedup and slice
    const unique = [...new Set(categorized[cat])].slice(0, 5);
    unique.forEach(text => {
      output += text + '\n\n---\n';
    });
  }
});

fs.writeFileSync('./saved/summary.txt', output, 'utf8');
console.log('Done');
