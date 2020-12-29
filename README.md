# Tests

Using Jest and Enzyme Test to covered test from redux store to page. Each of the test is named with format *-test.js and located inside folder `__test__`

two jest setup files are created:
- jest-config.js (main configuration to include coverage level, and test files regex)
- jest.setup.js (configuration to setup enzyme and others)

# Error handling
API calls are wrapped with try catch, and always return valid result, but there is some validation in place to mark it as failed.

ErrorDialog will pop up when the essentiall data like planets and vehicles are not ready.

# Modularity

files are structed based on its functionality as follows:
```
src
 - store
 - pages
 - components
 - apis
 - utils
```

These three basic models are presented in store and apis:
- planets
- vehicles
- results

# Responsive and CSS Semantics

The webpage is 100% responsive where is built from Material UI based off Material Design approaches.

It supports 3 different sizes at minimum from: 
- 600px and below
- 600px to 1024px
- 1024px and above 

Each of the React JSX follow with its SCSS file to cleanly separate the styling with its own page/component
