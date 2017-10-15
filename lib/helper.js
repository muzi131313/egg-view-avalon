'use strict';

module.exports = app => {
  return class ViewHelper extends app.Helper {
    // safe 由 [egg-view-nunjucks] 注入，在渲染时不会转义，
    // 否则在模板调用 shtml 会被转义
    shtml(str) {
      return this.safe(super.shtml(str));
    }
  };
};
