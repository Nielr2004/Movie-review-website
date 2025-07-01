import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
    this.setState({ error: error, errorInfo: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ padding: '20px', border: '1px solid red', color: 'red', backgroundColor: '#ffe6e6', margin: '20px', borderRadius: '5px' }}>
          <h2>Oops! Something went wrong!</h2>
          <p>We're very sorry for the inconvenience. Please try refreshing the page, or contact support if the problem persists.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '15px', fontSize: '0.9em', borderTop: '1px solid #ffaaaa', paddingTop: '10px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error Details (for debugging)</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;