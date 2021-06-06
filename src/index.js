import SearchPane from './main';
import './style/index.scss';

/* istanbul ignore next */
const install = function(Vue) {
  Vue.component(SearchPane.name, SearchPane);
}

SearchPane.install = install;

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default SearchPane;
