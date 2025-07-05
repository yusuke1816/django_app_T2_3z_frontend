'use client'

export default function Example() {
  return (
    <main className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 px-6 text-center">
      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
        <div className="relative rounded-full px-3 py-1 text-sm text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          Announcing our next round of funding.{' '}
          <a href="#" className="font-semibold text-indigo-600 relative">
            Read more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
      <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
        Data to enrich your online business
      </h1>
      <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <a
          href="#"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          login
        </a>
        <a href="#" className="text-sm font-semibold text-gray-900">
           sign in<span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  )
}
