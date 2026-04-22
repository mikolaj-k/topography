import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 border-2 border-red-800 rounded-sm p-6 text-center">
            <div className="text-red-500 text-4xl mb-3">⚠</div>
            <div className="font-bold text-zinc-100 text-lg mb-2">Coś poszło nie tak</div>
            <div className="text-sm text-zinc-400 mb-4">{this.state.error?.message}</div>
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 bg-red-600 border border-red-500 text-white text-sm uppercase tracking-wider font-semibold rounded-sm hover:bg-red-500"
            >
              Spróbuj ponownie
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
