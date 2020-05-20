var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"http://khaled.xyz"',
  MAPS_API: '"AIzaSyDoi0kDoetjxsvsctCrRb99I5lu1GJMj_8"',
  FACEBOOK_API: '"147151221990591"'
})
// khaled.xyz
// AIzaSyCPNQObVEJV2zAT-DlUXC4EbptLTu5aEDs

// AIzaSyBlRfNi2qDcy_zwjR53VVOyD-csjYSq4Qo