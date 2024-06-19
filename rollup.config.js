import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import scss from 'rollup-plugin-scss';

export default {
  input: 'src/main.js', // ваш основной файл входа
  output: {
    file: 'dist/bundle.js', // выходной файл
    format: 'iife', // формат вывода
  },
  plugins: [
    resolve(), // позволяет Rollup находить модули в node_modules
    commonjs(), // преобразует CommonJS модули в ES6
    scss({
      output: 'dist/styles.css', // выходной CSS файл
    }),
  ],
};
