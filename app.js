'use strict';

module.exports = app => {
  app.view.use('avalon', require('./lib/view'));
};
