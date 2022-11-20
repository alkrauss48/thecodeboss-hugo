import { nodeResolve } from '@rollup/plugin-node-resolve';
import { threeMinifier } from '@yushijinhun/three-minifier-rollup';
import terser from '@rollup/plugin-terser';
// import typescript from '@rollup/plugin-typescript';

const output = {
  dir: 'assets/dist',
  format: 'iife'
};

const plugins = [
  threeMinifier(), // Seems to shave off 20KB or so
  nodeResolve(),
  // typescript(),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser());
}

export default [{
  input: 'assets/js/main.ts',
  output,
  plugins,
}, {
  input: 'assets/js/home.js',
  output,
  plugins,
}];
