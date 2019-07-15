
// state.loading.actions.app.copyVersion

const module = {
  namespaced: true,
  state: {
    actions: {}
  },
  mutations: {
    loading(state, payload) {
      const {
        type,
        loading
      } = payload;
      const actions = {
        ...state.actions
      };
      set(actions, type, loading);

      state.actions = actions;
    }
  }
};

const set = (data, namespace, value) => {
  const names = namespace.split('/');
  const len = names.length - 1;

  names.reduce((prev, name, index) => {
    let temp = null;

    if (prev[name]) {
      temp = prev[name];
    } else {
      prev[name] = temp = {};
    }
    if (index === len) {
      prev[name] = value;
    }

    return temp;
  }, data);

  return data;
};

const validateConfig = config => {
  if (config.name && typeof config.name !== 'string') {
    throw new Error('loading plugin config name must be a string');
  }

  if (config.asNumber && typeof config.asNumber !== 'boolean') {
    throw new Error('loading plugin config asNumber must be a boolean');
  }

  if (config.whitelist && !Array.isArray(config.whitelist)) {
    throw new Error('loading plugin config whitelist must be an array of strings');
  }

  if (config.blacklist && !Array.isArray(config.blacklist)) {
    throw new Error('loading plugin config blacklist must be an array of strings');
  }

  if (config.whitelist && config.blacklist) {
    throw new Error('loading plugin config cannot have both a whitelist & a blacklist');
  }
};

const createActionHook = (store, moduleName, status) => {
  return (action, state) => {
    store.commit(`${moduleName}/loading`, {
      type: action.type,
      loading: status
    });
  };
};

export default config => {
  validateConfig(config);

  const moduleName = config.name || 'loading';

  return store => {
    // register loading module
    store.registerModule(moduleName, module);

    // add hook to registerModule
    const registerModule = store.registerModule.bind(store);

    store.registerModule = (apth, module, options) => {

      return registerModule(apth, module, options);
    };

    // listen actions hook
    store.subscribeAction({
      before: createActionHook(store, moduleName, true),
      after: createActionHook(store, moduleName, true)
    });
  };
};
