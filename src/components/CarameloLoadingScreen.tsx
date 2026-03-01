export function CarameloLoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-yellow-100 to-orange-100">
      <div className="mb-8 text-center">
        <div className="text-9xl mb-4 animate-bounce">🐕</div>
        <h1 className="text-4xl font-extrabold text-orange-900">Caramelo</h1>
        <p className="text-sm text-orange-700 mt-2">Saúde & Treinamento do seu Pet</p>
      </div>

      {/* Loading dots */}
      <div className="flex gap-2">
        <div className="h-3 w-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="h-3 w-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="h-3 w-3 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}
