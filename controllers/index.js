module.exports = {
  'GET /': async (ctx, next) => {
    ctx.redirect('/backgroundb');
  },
}