import React from 'react';
import {mount} from 'enzyme';

import {Option, Code} from './components';
import AutoExample from './';

class Driver {
  component;

  when = {
    created: props =>
      this.component = mount(<AutoExample {...props}/>)
  }

  get = {
    options: () => this.component.find(Option),
    codeBlock: () => this.component.find(Code)
  }
}

describe('AutoExample', () => {
  describe('options list', () => {
    it('should display two options', () => {
      const driver = new Driver();
      driver.when.created({
        parsedSource: {
          displayName: 'TestComponent',
          props: {
            stringProp: {type: {name: 'string'}},
            functionProp: {type: {name: 'func'}}
          }
        },
        componentProps: {
          stringProp: ''
        },
        exampleProps: {
          functionProp: () => ''
        }
      });
      const [prop1, prop2] = driver.get.options();

      expect(prop1.props.label).toBe('stringProp');
      expect(prop2.props.label).toBe('functionProp');
    });

    it('should categorize aria props', () => {
      const driver = new Driver();
      driver.when.created({
        parsedSource: {
          displayName: 'TestComponent',
          props: {
            'aria-label': {type: {name: 'string'}},
            'Aria-required': {type: {name: 'bool'}},
            ariaDisabled: {type: {name: 'bool'}},
            'anything-else': {type: {name: 'string'}}
          }
        },
        componentProps: {
          'anything-else': 'test'
        }
      });

      // expeting only 1 because others should be collapsed
      expect(driver.get.options().length).toEqual(1);
    });
  });

  describe('exampleProps', () => {
    it('should display "Interaction preview" for function type', () => {
      const driver = new Driver();
      driver.when.created({
        parsedSource: {
          displayName: 'TestComponent',
          props: {
            functionProp: {type: {name: 'func'}}
          }
        },
        exampleProps: {
          functionProp: () => {}
        }
      });

      const option = driver.get.options().props();
      expect(option.children.props.children).toBe('Interaction preview');
    });

    it('should display NodesList regardless of type in parsedSource', () => {
      const driver = new Driver();
      driver.when.created({
        parsedSource: {
          displayName: 'TestComponent',
          props: {
            someProp: {type: {name: 'unknown type name, something really obscure'}}
          }
        },
        exampleProps: {
          someProp: [1, 2, 3, 4, 5]
        }
      });

      const option = driver.get.options().props();
      expect(option.children).not.toBe(null);
    });
  });

  describe('codeExample', () => {
    it('should not render when `false`', () => {
      const driver = new Driver();
      driver.when.created({
        codeExample: false
      });
      expect(driver.get.codeBlock().length).toEqual(0);
    });
  });
});
