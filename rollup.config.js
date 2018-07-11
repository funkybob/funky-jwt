import buble from 'rollup-plugin-buble';
import minify from 'rollup-plugin-babel-minify';

export default {
        input: 'index.js',
	output: {
		sourcemap: true,
		format: 'es',
		file: 'dist/index.js'
	},
	plugins: [
		buble(),
		minify({comments: false})
	]
}
