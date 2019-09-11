

export interface LoadingConfig {
	name?: string
};

const num2bool = (num: number) => {
  return num > 0;
}

const set = (data: any, namespace: string, value: boolean) => {
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

const setModuleAction = (actionState: any, module: any, basePath: string) => {
  const {
    actions,
    modules
  } = module;

  Object.keys(actions).forEach((key: string) => {
    set(actionState, `${basePath}/${key}`, false);
  });
  if (modules) {
    Object.keys(modules).forEach((key: string) => {
      setModuleAction(actionState, modules[key], `${basePath}/${key}`);
    });
  }

  return actionState;
};

const validateConfig = (config: LoadingConfig) => {
  if (config.name && typeof config.name !== 'string') {
    throw new Error('vuex-wait plugin config name must be a string');
  }
};

export default (config: LoadingConfig = {}) => {
  validateConfig(config);

  let global = 0;
  const moduleName = config.name || 'loading';
  const module = {
    namespaced: true,
    state: {
      global: num2bool(global),
      actions: {}
    },
    mutations: {
      loading(state: any, payload: any) {
        const {
          type,
          loading,
          global
        } = payload;
        const actions = {
          ...state.actions
        };
  
        set(actions, type, loading);
        state.actions = actions;
        state.global = num2bool(global);
      }
    }
  };
  const createActionHook = (store: any, moduleName: string, status: boolean) => {
    return (action: any) => {
      global += status ? 1 : -1;
      store.commit(`${moduleName}/loading`, {
        type: action.type,
        loading: status,
        global
      });
    };
  };

  return (store: any) => {
    // initialize actions loading state
    Object.keys(store._actions).forEach((key: string) => {
      set(module.state.actions, key, false);
    });

    // register loading module
    store.registerModule(moduleName, module);

    // add hook to registerModule
    const registerModule = store.registerModule.bind(store);

    store.registerModule = (path: any, module: object, options?: object) => {
      const state = store.state;
      const basePath = typeof path === 'string' ? path : path.join('/');

      setModuleAction(state[moduleName].actions, module, basePath);
      return registerModule(path, module, options);
    };

    const before = createActionHook(store, moduleName, true);
    const after = createActionHook(store, moduleName, false);
    const dispatch = store.dispatch.bind(store);

    // override dispatch function
    store.dispatch = (...args: any[]) => {
      let [ action ] = args;

      action = typeof action === 'string' ? { type: action } : action;

      before(action);
      return dispatch(...args).then((res: any) => {
        after(action);
        return res;
      }, (err: any) => {
        after(action);
        throw err;
      });
    };

    // listen actions hook
    // store.subscribeAction({
    //   before: createActionHook(store, moduleName, true),
    //   after: createActionHook(store, moduleName, false)
    // });
  };
};
