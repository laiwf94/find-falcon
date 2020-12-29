import React from 'react';
import { shallow, render, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
const { JSDOM } = require('jsdom');

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.__TEST__ = true;
global.__DEV__ = false;
global.__BUILD_PARAMS__ = false;
console.error = () => { };

const options = {
  resources: 'usable',
  runScripts: 'dangerously',
  beforeParse(window) {
    window.alert = undefined;
    window.alert = msg => window.console.log('Alert:', msg);
    window.confirm = (msg) => {
      window.console.log('Confirm:', msg);
      return true;
    };
    window.scrollTo = (x, y) => window.console.log('ScrollTo X:', x, ' Y:', y);
    window.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
  },
};

// setup the global window and document for enzyme's mount()
const dom = new JSDOM('<!doctype html><html><body></body></html>', options);
global.dom = dom;
global.window = dom.window;
global.localStorage = global.window.localStorage;
global.document = global.window.document;
global.navigator = global.window.navigator;
global.XMLHttpRequest = function XMLHttpRequest() {
  return { XMLHttpRequest: 'MockingTheXMLHttpRequestForHeadlessBrowser' };
};

process.env.REACT_APP_VEHICLE_URL='https://5f5ff7f790cf8d00165573ed.mockapi.io/vehicles';
process.env.REACT_APP_PLANET_URL='https://5f5ff7f790cf8d00165573ed.mockapi.io/planets';
process.env.REACT_APP_FIND_URL='https://5f5ff7f790cf8d00165573ed.mockapi.io/find';
process.env.REACT_APP_TOKEN_URL='https://5f5ff7f790cf8d00165573ed.mockapi.io/token';