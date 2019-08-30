import Ember from 'ember';
import PagedRemoteArray from './paged-remote-array';
import Util from '../util';
import { camelize } from '@ember/string';
import { singularize } from 'ember-inflector';

export default Ember.Mixin.create({
  perPage: 10,
  startingPage: 1,

  model: function(params) {
    return this.findPaged(this._findModelName(this.get('routeName')), params);
  },

  _findModelName: function(routeName) {
      return singularize(
        camelize(routeName)
      );
  },

  findPaged: function(name, params, options, callback) {
    var opt = options || {};
    var mainOps = {
      page: params.page || this.get('startingPage'),
      perPage: params.perPage || this.get('perPage'),
      modelName: name,
      zeroBasedIndex: opt.zeroBasedIndex || false,
      store: this.get('store')
    };

    if (params.paramMapping) {
      mainOps.paramMapping = params.paramMapping;
    }

    var otherOps = Util.paramsOtherThan(params,["page","perPage","paramMapping","zeroBasedIndex"]);
    mainOps.otherParams = otherOps;

    mainOps.initCallback = callback;

    return PagedRemoteArray.create(mainOps);
  }
});
