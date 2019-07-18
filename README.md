# vuex-wait

Adds loading state for actions to [Vuex](https://github.com/vuejs/vuex) automatically. 
You don't need to maintain asynchronous action state any more


## Install

```shell
npm install vuex-wait --save
```

## Usage 

```js
import Vue from 'vue';
import Vuex from 'vuex';
import createLoading from 'vuex-wait';

Vue.use(Vuex);

const options = {};
const store = new Vuex.Store({
  plugins: [ createLoading(options) ]
});
```

Then we can access loading state from store.

## Options

### name

```js
{ name: 'girl' }
```

In which case, loading can be accessed from `store.state.girl`

Defaults to `loading`


## State Structure

```js
{
  loading: {
    global: false,
    actions: {
      increment: false,
      incrementAsync: false
    }
  }
}
```

## License

[MIT](https://github.com/maiwenan/vuex-wait/blob/master/README.md)