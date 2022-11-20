import typescript from '@rollup/plugin-typescript';

const output = {
  dir: 'assets/dist',
  format: 'iife'
};

const plugins = [typescript()];

export default [{
  input: 'assets/js/main.ts',
  output,
  plugins,
}, {
  external: [
    'three',
  ],
  output: {
    globals: {
      'three': 'three',
    },
  },
  input: 'assets/js/home.ts',
  output,
  plugins,
}];
