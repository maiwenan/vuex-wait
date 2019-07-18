const createStore = require('./createStore');

describe('vuex-await plugin test cases', () => {
  test('init loading module', () => {
    const store = createStore();
    const state = store.state.loading;

    expect(state.global).toBe(false);
    expect(state.actions.increment).toBe(false);
    expect(state.actions.incrementAsync).toBe(false);
  });

  test('loading module name should be girl', () => {
    const store = createStore({
      name: 'girl'
    });
    const state = store.state.girl;

    expect(state.global).toBe(false);
    expect(state.actions.increment).toBe(false);
    expect(state.actions.incrementAsync).toBe(false);
  });

  test('should throw if loading name is not a string', () => {
    const init = () => {
      createStore({
        name: 123
      });
    };

    expect(init).toThrow()
  });

  test('loading.global should be true before dispatched action', () => {
    const store = createStore();

    store.dispatch('increment');

    expect(store.state.loading.global).toBe(true);
  });

  test('loading.global should be false after dispatched action', async () => {
    const store = createStore();

    await store.dispatch('incrementAsync');

    expect(store.state.loading.global).toBe(false);
  });

  test('loading.actions.increment should be true before dispatched action', () => {
    const store = createStore();

    store.dispatch('increment');

    expect(store.state.loading.actions.increment).toBe(true);
  });

  test('loading.actions.increment should be true after dispatched action', async () => {
    const store = createStore();

    await Promise.resolve();

    expect(store.state.loading.actions.increment).toBe(false);
  });

  test('loading.actions.incrementAsync should be true before dispatched action', () => {
    const store = createStore();

    store.dispatch('incrementAsync');

    expect(store.state.loading.actions.incrementAsync).toBe(true);
  });

  test('loading.actions.incrementAsync should be false after dispatched action', async () => {
    const store = createStore();

    await store.dispatch('incrementAsync');

    expect(store.state.loading.actions.incrementAsync).toBe(false);
  });

  test('loading.global should be false after dispatched incrementAsync and increment action', async () => {
    const store = createStore();
    const promise = store.dispatch('incrementAsync');

    store.dispatch('increment');
    expect(store.state.loading.global).toBe(true);

    await Promise.resolve();
    expect(store.state.loading.global).toBe(true);
    
    await promise;
    expect(store.state.loading.global).toBe(false);
  });

  test('init registerModule loading state', async () => {
    const store = createStore();

    store.registerModule('a', {
      namespaced: true,
      state: {
        count: 0
      },
      mutations: {
        incrementAsync(state, payload) {
          state.count += 1;
        }
      },
      actions: {
        incrementAsync({ commit }) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              commit('incrementAsync');
              resolve();
            }, 2000);
          });
        }
      },
      modules: {
        b: {
          namespaced: true,
          state: {
            count: 0
          },
          mutations: {
            incrementAsync(state, payload) {
              state.count += 1;
            }
          },
          actions: {
            incrementAsync({ commit }) {
              return new Promise((resolve, reject) => {
                setTimeout(() => {
                  commit('incrementAsync');
                  resolve();
                }, 2000);
              });
            }
          }
        }
      }
    });

    expect(store.state.loading.actions.a.incrementAsync).toBe(false);
    expect(store.state.loading.actions.a.b.incrementAsync).toBe(false);
  });

  test('init register nested module loading state', async () => {
    const store = createStore();

    store.registerModule('a', {
      namespaced: true,
      state: {
        count: 0
      },
      mutations: {
        incrementAsync(state, payload) {
          state.count += 1;
        }
      },
      actions: {
        incrementAsync({ commit }) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              commit('incrementAsync');
              resolve();
            }, 2000);
          });
        }
      }
    });

    store.registerModule(['a', 'b'], {
      namespaced: true,
      state: {
        count: 0
      },
      mutations: {
        incrementAsync(state, payload) {
          state.count += 1;
        }
      },
      actions: {
        incrementAsync({ commit }) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              commit('incrementAsync');
              resolve();
            }, 2000);
          });
        }
      }
    });

    expect(store.state.loading.actions.a.incrementAsync).toBe(false);
    expect(store.state.loading.actions.a.b.incrementAsync).toBe(false);
  });
});