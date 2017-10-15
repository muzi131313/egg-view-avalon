'use strict';

const ViewHelper = require('./helper');
const fs = require('fs');
const avalon = require('avalon2');

/**
 * [exports avalon渲染view]
 * @type {[type]}
 */
module.exports = class AvalonView {
  constructor(ctx) {
    this.ctx = ctx;
    this.app = ctx.app;
    this.config = ctx.app.config.avalon;
  }
  render(filename, locals) {
    const self = this;
    locals.helper = new ViewHelper(this.ctx);
    // 调用 avalon render
    return new Promise((resolve, reject) => {
      // 异步调用 API
      fs.readFile(filename, function(err, pageStr) {
        if (err) {
          reject(err);
        } else {
          resolve(self.renderString(pageStr, locals));
        }
      });
    });
  }

  /**
   * [renderString 字符串模板渲染, from :
   *               https://github.com/RubyLouvre/avalon/issues/1868
   *               test:
   *               avalon.template('<div ms-for="p in @b">{{p}}</div><span>{{@a}}</span>',{a:'asdf',b:['c','d']})]
   * @Author   liyanfeng
   * @DateTime 2017-10-15T21:48:23+0800
   * @param    {[type]}                 tpl    ['<div ms-for="p in @b">{{p}}</div><span>{{@a}}</span>']
   * @param    {[type]}                 locals [{a:'asdf',b:['c','d']}]
   * @return   {[type]}                        [description]
   */
  renderString(tpl, locals) {
    try {
      let result = tpl;
      const _tmpId = Math.random().toString();
      const skipArray = [];
      for (const k in locals) {
        skipArray.push(k);
      }

      const vm = avalon.define(avalon.mix(true, locals, { $id: _tmpId, $skipArray: skipArray }));
      const rd = avalon.scan(tpl, vm);
      result = avalon.vdom(rd.vnodes, 'toHTML');
      // result=  rd.root.dom.outerHTML;
      delete avalon.vmodels[_tmpId];
      result = result.replace(/<!--[\w\W\r\n]*?-->/gmi, '');
      return Promise.resolve(result);
    } catch (err) {
      return Promise.reject(err);
    }
  }
};
