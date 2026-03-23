import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-8xl font-bold text-[#C42959]">404</h1>
      <p className="mt-4 text-xl text-gray-600">Página no encontrada</p>
      <p className="mt-2 text-gray-400">
        La página que buscas no existe o fue movida.
      </p>
      <Link
        href="/"
        className="mt-8 px-6 py-3 bg-[#C42959] text-white rounded-lg hover:bg-[#a8214a] transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
