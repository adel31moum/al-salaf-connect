import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[Al-Salaf Connect] Unhandled UI error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-parchment text-center px-6">
          <div>
            <h2 className="font-display text-2xl text-emeraldDeep mb-3">حدث خطأ غير متوقع</h2>
            <p className="text-ink/60 mb-6">نعتذر عن هذا الخلل. يمكنك إعادة تحميل الصفحة أو العودة للرئيسية.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-emeraldDeep px-6 py-2 rounded"
            >
              إعادة التحميل
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
