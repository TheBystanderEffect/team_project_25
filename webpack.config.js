const path = require('path');

module.exports = {
    entry: './app/bootstrap.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
             {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, 'tsconfig.json')
                        }
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'TP_webApp', 'TP_webApp', 'wwwroot', 'js'),
        filename: 'app.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    }
};