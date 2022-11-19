import typescript from '@rollup/plugin-typescript';

export default {
  input: 'assets/js/main.ts',
  output: {
    file: 'assets/dist/bundle.js',
    format: 'iife'
  },
  plugins: [typescript()]
};
