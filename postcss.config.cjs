const autoprefixer = require('autoprefixer');
const scrollbar = require('postcss-scrollbar');

const config = {
	plugins: [autoprefixer, scrollbar],
};

module.exports = config;
