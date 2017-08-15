const Koa = require('koa'); // import a class
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const controller = require('./controller');

const app = new Koa();

// in fact, NODE_ENV may be undefined
const isProduction = process.env.NODE_ENV === 'production';

// Log request and time consumption
app.use(async (ctx, next) => {
  console.log(`Processing ${ctx.request.method} ${ctx.request.url}`);

  var start = new Date().getTime();
  await next();
  var execTime = new Date().getTime() - start;
  ctx.response.set('X-Response-Time', execTime);// html header
});

// Load static files
if (!isProduction) {
  app.use(serve('static'));
}

// Parse Post request
app.use(bodyParser()); // must palce before using router

// Process route
app.use(controller());

const port = 8888;
app.listen(port, () => {
  console.log(`Open browser, visit: http://127.0.0.1:${port}/`);
});