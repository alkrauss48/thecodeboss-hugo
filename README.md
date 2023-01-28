# [thecodeboss.dev](https://thecodeboss.dev) Hugo Site

This is a rebuild of my personal portfolio site, using the
[Hugo](https://gohugo.io/) static site generator, written in
[Go](https://go.dev/).

## To Install
First, you need Go installed. Next, install Hugo:
```sh
brew install hugo
```

Lastly, install the theme's node modules:
```sh
cd themes/thecodeboss
nvm use # (optional) only if you have NVM installed
npm install
```

## To Run

### Build the CSS
```sh
cd themes/thecodeboss
npm run css-watch
```

### Build the JS
```sh
cd themes/thecodeboss
npm run js-watch
```

### Start the application server
```sh
hugo server --disableFastRender
```

## Linting
```sh
cd themes/thecodeboss

# JavaScript Linting
npx eslint assets/js
```
