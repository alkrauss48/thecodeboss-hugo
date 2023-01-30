# [thecodeboss.dev](https://thecodeboss.dev) Hugo Site

This is a rebuild of my personal portfolio site, using the
[Hugo](https://gohugo.io/) static site generator, written in
[Go](https://go.dev/).

## Running in Docker**

** Don't do this if you want to dev on this project. If you want to develop on
this project, follow the instructions in the next section.

Docker will build in production mode, and will run as purely static
files (which is what Hugo naturally outputs) served by Nginx. This means there
will be **no** actively-running build automation and/or hot reloading, which would be
a terrible experience for developing.

```sh
docker compose up

# Navigate to http://localhost:1313
```

## To Install for Development

First, you need Go installed. Next, install Hugo (example using
[Homebrew](https://brew.sh/) for macOS):
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

You will need to run 3 continuous processes:

* CSS build automation
* JS build automation
* The Hugo server

Once they are all running, navigate to http://localhost:1313.

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

# Navigate to http://localhost:1313
```

## Linting
```sh
cd themes/thecodeboss

# JavaScript Linting
npm run lint:js

# Style Linting
npm run lint:css
```

## Testing
```sh
cd themes/thecodeboss

# Run Jest tests
npm run test
```
