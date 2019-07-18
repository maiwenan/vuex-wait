import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript';
import { minify } from 'uglify-es';

const pkg = require('./package.json');

const env = process.env.NODE_ENV;

const config = {
	input: 'src/index.ts',
	plugins: [
		typescript({
			typescript: require('typescript')
		}),
		replace({
			'process.env.NODE_ENV': JSON.stringify(env)
		})
	],
	output: [
		{
			name: 'VuexLoading',
			file: pkg.browser,
			format: 'umd',
			exports: 'named',
			sourcemap: true
		},
		{ file: pkg.main, format: 'cjs', exports: 'named', sourcemap: true }, // CommonJS Modules
		{ file: pkg.module, format: 'es', exports: 'named', sourcemap: true }, // ES Modules
		{ file: pkg.types, format: 'es' }
	]
}

if (env === 'production') {
	config.plugins.push(
		uglify(
			{
				compress: {
					pure_getters: true,
					unsafe: true,
					unsafe_comps: true,
					warnings: false
				}
			},
			minify
		)
	);
};

export default [config];
