const path = require('path');
console.log(123);
var pathconfig = {
    public: path.join(__dirname, 'public'),
    publicJs: path.join(__dirname, 'public') + '/js',
    viewPath: path.join(__dirname, 'resources', 'views'),
    assetsPath: path.join(__dirname, 'resources', 'assets'),
    sourceSass: path.join(__dirname,'resources','assets','sass'),
    sourceES5path: path.join(__dirname, 'resources', 'assets', 'js', 'es5'),
    sourceES6path: path.join(__dirname, 'resources', 'assets', 'js', 'es6')
};
module.exports = {
    entry: {
        "/js/b-index": pathconfig.sourceES5path + '/index.js',
        "/js/b-game": pathconfig.sourceES6path + '/Game.js'
    },
    output: {
        path: pathconfig.public,
        filename: '[name].js'
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
            },
            {
                test: /\.scss$/,
                loader: "style-loader!css-loader!sass-loader"
            },
            {
                test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                loader : 'file-loader'
            }
        ]
    },
    watch: true
};
console.log(__dirname);