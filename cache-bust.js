const fs = require('fs');
const ts = Date.now();

['shipping.html', 'returns.html'].forEach(function(f) {
    let h = fs.readFileSync(f, 'utf8');
    // Remove any old cache-bust comment
    h = h.replace(/\r?\n<!-- cache-bust: \d+ -->/g, '');
    // Add new one right before </head>
    h = h.replace('</head>', '\n<!-- cache-bust: ' + ts + ' -->\n</head>');
    fs.writeFileSync(f, h);
    console.log(f + ': cache-busted with ' + ts);
});
