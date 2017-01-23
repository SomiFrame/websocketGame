const path = require('path');
console.log(123);
var pathconfig = {
    public: path.join(__dirname, 'public'),
    viewPath: path.join(__dirname, 'resources', 'views'),
    assetsPath: path.join(__dirname, 'resources', 'assets'),
    sourceES5path: path.join(__dirname, 'resources', 'assets', 'js','es5'),
    sourceES6path: path.join(__dirname, 'resources', 'assets', 'js','es6')
};
module.exports = {
    entry: {
        index: pathconfig.sourceES5path + '/index.js',
        game: pathconfig.sourceES6path + '/Game.js'
    },
    output: {
        path: pathconfig.public+'/js/',
        filename: 'b-[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    },
    watch: true
};
console.log(__dirname);