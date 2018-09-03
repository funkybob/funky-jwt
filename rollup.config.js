import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export default {
        input: 'index.ts',
	output: {
		sourcemap: true,
		format: 'esm',
		file: 'dist/index.js'
	},
	plugins: [
		typescript(),
		terser({
			module: true,
			nameCache: {},
			output: {
				beautify: true
			}
		})
	]
}
