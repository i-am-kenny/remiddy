import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  external: [
    'aws-sdk',
    'http-errors',
    'joi',
    'middy'
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    json(),
    commonjs(),
    globals(),
    builtins()
  ]
};