import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-center px-4 lg:px-40 py-4 h-12 sm:h-20 w-full sm:pt-2 pt-4 border-t mt-5 flex sm:flex-row flex-col justify-between items-center space-y-3 sm:mb-0 mb-3 border-gray-200">
      <div className="text-gray-500">
        <Link
          className="text-blue-600 hover:underline font-bold"
          href="https://github.com/leap-ai/headshots-starter"
          target="_blank"
        >
          Build With Love In Florida
        </Link>{" "}
        powered by{"MattD Company Labs"}
        <Link
          className="text-blue-600 hover:underline font-bold"
          href="https://www.mattdcompany.com/"
          target="_blank"
        >
          MattD Company,{"Owner"}
    </footer>
  );
}
