import typescript from 'typescript';
import tsPlugin from 'rollup-plugin-typescript';
import uglify from 'rollup-plugin-uglify';

const prod = process.env.BUILD === 'production';

export default [
  {
    input: 'src/all.ts',

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
  },
  {
    input: 'src/drawer-only.ts',

    output: {
      file: prod ? 'build/pulling-drawer.min.js' : 'build/pulling-drawer.js',
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
  },
  {
    input: 'src/reveal-only.ts',

    output: {
      file: prod ? 'build/pulling-reveal.min.js' : 'build/pulling-reveal.js',
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
  },
];
