const fs = require('fs');
const path = require('path');

// Create colorful placeholder images as SVG
const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
  '#A9DFBF', '#F9E79F', '#D5A6BD', '#A3E4D7', '#FADBD8',
  '#D6EAF8', '#D5DBDB', '#FAD7A0', '#A9CCE3', '#D2B4DE',
  '#AED6F1', '#A3E4D7', '#F9E79F', '#D5A6BD', '#A3E4D7',
  '#FADBD8', '#D6EAF8'
];

const symbols = [
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻',
  '🏀', '🏈', '⚽', '🎾', '🏐', '🏓', '🏸', '🏒',
  '🌺', '🌻', '🌷', '🌸', '🌹', '🌼', '🌿', '🍀',
  '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒'
];

// Generate 32 placeholder images
for (let i = 1; i <= 32; i++) {
  const color = colors[(i - 1) % colors.length];
  const symbol = symbols[(i - 1) % symbols.length];
  
  const svg = `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${color}CC;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad${i})" rx="12"/>
    <circle cx="100" cy="100" r="60" fill="white" opacity="0.2"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" dy=".3em">${symbol}</text>
  </svg>`;

  fs.writeFileSync(path.join(__dirname, '../public/placeholders', `placeholder-${i}.svg`), svg);
}

console.log('Generated 32 placeholder images!');







