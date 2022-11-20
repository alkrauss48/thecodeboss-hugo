import { nodeResolve } from '@rollup/plugin-node-resolve';
// import typescript from '@rollup/plugin-typescript';

const output = {
  dir: 'assets/dist',
  format: 'iife'
};

const plugins = [
  nodeResolve(),
  // typescript(),
];

export default [{
  input: 'assets/js/main.ts',
  output,
  plugins,
}, {
  input: 'assets/js/home.js',
  output,
  plugins,
}];
