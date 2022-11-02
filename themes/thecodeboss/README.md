# [thecodeboss.dev](https://thecodeboss.dev) Hugo Site

This is a rebuild of my personal portfolio site, using the
[Hugo](https://gohugo.io/) static site generator, written in
[Go](https://go.dev/).

## To Install
First, you need Go installed. Next, install Hugo:
```
brew install hugo
```

Lastly, install the theme's node modules:
```
cd themes/thecodeboss
nvm use # (optional) only if you have NVM installed
npm install
```

## To Run

### Build the CSS
```
cd themes/thecodeboss
npm run scss-watch
```

### Build the JS
```
cd themes/thecodeboss
npm run scss-watch
```

### Start the application server
```
hugo server --disableFastRender
```
