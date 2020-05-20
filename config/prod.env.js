config = {
  NODE_ENV: '"production"',
  API_URL: '"http://khaled.xyz"',
  MAPS_API: '"AIzaSyDoi0kDoetjxsvsctCrRb99I5lu1GJMj_8"',
  FACEBOOK_API: '"147151221990591"'
}

if (!process.env.PLATFORM || process.env.PLATFORM == 'DESKTOP') {
  config.HISTORY_MODE = '"history"';
} else {
  config.HISTORY_MODE = '"hash"';
}

var isWin = /^win/.test(process.platform);
if (isWin && config.NODE_ENV === "production") {
  config.ROUTE_BASE = '"/app/"';
} else {
  if (process.env.PLATFORM && process.env.PLATFORM == 'DESKTOP') {
    config.ROUTE_BASE = '"/app/"';
  } else {
    if (process.env.SERVE) {
      config.ROUTE_BASE = '"/"';
    } else {
      config.ROUTE_BASE = '""';
    }
  }
}

module.exports = config;
