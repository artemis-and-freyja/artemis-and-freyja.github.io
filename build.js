// -- Step 1
const yargs = require('yargs');
const metalsmith = require('metalsmith');
const livereload = require('livereload');
const connect = require('connect');
const static = require('serve-static');
const chokidar = require('chokidar');
const metadata = require('metalsmith-filemetadata');
// --- Step 2
const markdown = require('metalsmith-markdown');
const handlebars = require('handlebars');
const layouts = require('metalsmith-layouts');
// -- Step 2a
const partials = require("metalsmith-discover-partials");
// -- Step 3
const assets = require('metalsmith-assets');
// -- Step 4
const sass = require('metalsmith-sass');
// -- Step 5
const collections = require('metalsmith-collections');

const build = (destination, liveReloadPort) => {
  // Step 1: this is our metalsmith build!
  metalsmith(__dirname)
    .source('src')
    .destination(destination)
    .use(metadata([{ pattern: '**/*.md', metadata: { liveReloadPort } }]))

    // --- Step 2: HTML
    .use(markdown())

    // -- Step 5: Collections
    .use(collections({
      blog: {
        sortBy: 'title'
      }
    }))

    // --- Step 2: HTML
    .use(partials({
      directory: 'src/partials'
    }))
    .use(layouts({
      directory: 'src/layouts',
      default: 'layout.hbs',
      pattern: '**/*.html'
    }))

    // -- Step 3: Assets
    .use(assets({
      source: 'src/assets',
      destination: 'assets'
    }))

    // -- Step 4: Styles
    .use(sass())

    .build((err, files) => {
      console.log(err ?? 'build complete!');
    });
};

// ---
// Don't worry too much about the code beyond this point, it's just
// some helpful tooling to make working on our website a little nicer

// this is just a utility for parsing command-line arguments to a node script.
const argv = yargs(process.argv.slice(2))
  .options({
    dev: { type: 'boolean', default: false },
    port: { type: 'number', default: 8080 },
    'live-reload-port': { type: 'number', default: 35729 }
  })
  .argv;

if (argv.dev) {
  // if we're in development mode, watch the source directory and re-build
  // whenever anything changes
  build('./build', argv['live-reload-port']);

  chokidar
    .watch(__dirname + '/src', { ignored: /(^|[\/\\])\../, persistent: true })
    .on('change', () => build('./build', argv['live-reload-port']));

  // run a 'live reload' server to tell the client to refresh when there
  // are updates
  livereload
    .createServer({
      delay: 1000, debug: true, port: argv['live-reload-port']
    })
    .watch(__dirname + '/build');

  // run a static file server of our built website
  connect()
    .use(static(__dirname + '/build'))
    .listen(argv.port);

} else {
  // if we're not in development mode, just build the site so we can publish it
  build('./dist');
}


