const PublicController = require('../features/public/public.controller');

const registerPublicRoutes = (app) => {
  app.post('/contact', PublicController.contactUs);

  app.get('/calc/:building', PublicController.calculateQuote);
}

module.exports = {registerPublicRoutes};