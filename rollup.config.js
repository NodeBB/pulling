import typescript from 'typescript';
import tsPlugin from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';

const prod = process.env.BUILD === 'production';

export default {
  input: 'src/index.ts',

  output: {
    file: prod ? 'build/pulling.min.js' : 'build/pulling.js',
    format: 'umd',
    name: 'Pulling',
    sourcemap: true,
    amd: {
      id: 'pulling',
    },
  },

  plugins: [
    tsPlugin({
      typescript,
    }),
    (prod && uglify()),
  ],
};
