import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    // You can log the error or perform other actions here
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render a custom error message or component here
      return <div>Error: Something went wrong.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
