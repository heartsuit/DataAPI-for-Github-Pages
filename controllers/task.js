const bing = require('../core/bing');

module.exports = {
  // Get Bing daily background image using jsonp
  'GET /backgroundj': async (ctx) => {
    let img = await bing.getBackground(ctx);
    ctx.response.body = `jsonpCallback({"background":"${img}"})` // build jsonp string
  },

  // Get Bing daily background image using buffer
  'GET /backgroundb': async (ctx) => {
    let buffer = await bing.getBackgroundBuffer(ctx);
    ctx.response.type = 'image/jpeg'; // if type is not set, browser will try to download the image
    ctx.response.body = buffer;
  },
}