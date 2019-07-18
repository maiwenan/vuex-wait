/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var num2bool = function (num) {
    return num > 0;
};
var set = function (data, namespace, value) {
    var names = namespace.split('/');
    var len = names.length - 1;
    names.reduce(function (prev, name, index) {
        var temp = null;
        if (prev[name]) {
            temp = prev[name];
        }
        else {
            prev[name] = temp = {};
        }
        if (index === len) {
            prev[name] = value;
        }
        return temp;
    }, data);
    return data;
};
var setModuleAction = function (actionState, module, basePath) {
    var actions = module.actions, modules = module.modules;
    Object.keys(actions).forEach(function (key) {
        set(actionState, basePath + "/" + key, false);
    });
    if (modules) {
        Object.keys(modules).forEach(function (key) {
            setModuleAction(actionState, modules[key], basePath + "/" + key);
        });
    }
    return actionState;
};
var validateConfig = function (config) {
    if (config.name && typeof config.name !== 'string') {
        throw new Error('vuex-wait plugin config name must be a string');
    }
};
var index = (function (config) {
    if (config === void 0) { config = {}; }
    validateConfig(config);
    var global = 0;
    var moduleName = config.name || 'loading';
    var module = {
        namespaced: true,
        state: {
            global: num2bool(global),
            actions: {}
        },
        mutations: {
            loading: function (state, payload) {
                var type = payload.type, loading = payload.loading, global = payload.global;
                var actions = __assign({}, state.actions);
                set(actions, type, loading);
                state.actions = actions;
                state.global = num2bool(global);
            }
        }
    };
    var createActionHook = function (store, moduleName, status) {
        return function (action) {
            global += status ? 1 : -1;
            store.commit(moduleName + "/loading", {
                type: action.type,
                loading: status,
                global: global
            });
        };
    };
    return function (store) {
        // initialize actions loading state
        Object.keys(store._actions).forEach(function (key) {
            set(module.state.actions, key, false);
        });
        // register loading module
        store.registerModule(moduleName, module);
        // add hook to registerModule
        var registerModule = store.registerModule.bind(store);
        store.registerModule = function (path, module, options) {
            var state = store.state;
            var basePath = typeof path === 'string' ? path : path.join('/');
            setModuleAction(state[moduleName].actions, module, basePath);
            return registerModule(path, module, options);
        };
        // listen actions hook
        store.subscribeAction({
            before: createActionHook(store, moduleName, true),
            after: createActionHook(store, moduleName, false)
        });
    };
});

export default index;
