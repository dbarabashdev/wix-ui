import React from 'react';
import {func, node, array, object, oneOfType} from 'prop-types';
import Wix from 'Wix';

class SdkThemeGenerator extends React.PureComponent {
  static propTypes = {
    render: func.isRequired,
    theme: oneOfType([func, object]).isRequired,
    events: array.isRequired
  };

  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.state = {
      calculatedTheme: getTheme(props.theme),
      events: props.events.filter(event => Wix.Events[event] !== undefined)
    };
  }

  componentDidMount() {
    this.state.events.forEach(event => Wix.addEventListener(Wix.Events[event], this.update));
  }

  componentWillUnmout() {
    this.state.events.forEach(event => Wix.removeEventListener(Wix.Events[event], this.update));
  }

  update(data) {
    this.setState({calculatedTheme: getTheme(this.props.theme, data)});
  }

  render() {
    return this.props.render({calculatedTheme: this.state.calculatedTheme});
  }
}

export const ResponsiveThemedComponent = ({children, theme, events}) => (
  <SdkThemeGenerator
    theme={theme}
    events={events}
    render={({calculatedTheme}) => React.cloneElement(children, {theme: calculatedTheme})}
    />
);

ResponsiveThemedComponent.propTypes = {
  children: node,
  theme: oneOfType([func, object]),
  events: array
};

ResponsiveThemedComponent.defaultProps = {
  children: null,
  theme: () => {},
  events: ['STYLE_PARAMS_CHANGE']
};

function getTheme(theme, params) {
  return typeof theme === 'function' ? theme(params) : theme;
}