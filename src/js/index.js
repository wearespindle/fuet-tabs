const templates = require('./templates')

const Tab = require('./tab')(templates.tab)
const Tabs = require('./tabs')(templates.tabs)

module.exports = {Tab, Tabs}
