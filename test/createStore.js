const Vue = require('vue');
const Vuex = require('vuex');
const createLoading = require('../src/index').default;

Vue.use(Vuex);

module.exports = (options) => {
  try {
    return new Vuex.Store({
      state: {
        count: 0
      },
      mutations: {
        increment(state, payload) {
          state.count += 1;
        }
      },
      actions: {
        increment({ commit }) {
          commit('increment');
        },
        incrementAsync({ commit }) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              commit('increment');
              resolve();
            }, 2000);
          });
        }
      },
      plugins: [ createLoading(options) ]
    });
  } catch (err) {
    throw err;
  }
};
