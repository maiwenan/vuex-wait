import Vue from 'vue';
import Vuex from 'vuex';
import createLoading from '../../../src/index';
// import createLoading from '../../../dist/vuex-wait.esm.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    demo: 0
  },
  mutations: {
    increment(state, payload) {
      state.demo += 1;
    }
  },
  actions: {
    increment({ commit }) {
      commit('increment');
      
      // return new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     commit('increment');
      //     resolve();
      //   }, 2000);
      // });
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        demo: 0
      },
      mutations: {
        increment(state, payload) {
          state.demo += 1;
        }
      },
      actions: {
        increment({ commit }) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              commit('increment');
              resolve();
            }, 2000);
          });
        }
      }
    }
  },
  plugins: [ createLoading({}) ]
});

// ['b', 'c']
store.registerModule(['a', 'c'], {
  namespaced: true,
  state: {
    demo: 0
  },
  mutations: {
    increment(state, payload) {
      state.demo += 1;
    }
  },
  actions: {
    increment({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('increment');
          resolve();
        }, 2000);
      });
    }
  },
  modules: {
    a: {
      namespaced: true,
      state: {
        demo: 0
      },
      mutations: {
        increment(state, payload) {
          state.demo += 1;
        }
      },
      actions: {
        increment({ commit }) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              commit('increment');
              resolve();
            }, 2000);
          });
        }
      }
    }
  }
});

export default store;
