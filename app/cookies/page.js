export const metadata = {
  title: 'Cookie Policy | Modave',
  description: 'Learn how Modave uses cookies to enhance your shopping experience, provide secure checkout, and analyze site usage.'
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">Cookie Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          This Cookie Policy explains how we use cookies and similar technologies on our website to deliver core functionality,
          personalize your experience, provide secure payments, and analyze performance.
        </p>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What are cookies?</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cookies are small text files stored on your device when you visit a website. They help the site remember your
              actions and preferences so you don’t have to re-enter them each time you return.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How we use cookies</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400">
              <li><span className="font-medium text-gray-900 dark:text-white">Essential:</span> enable core site features like cart, checkout, and authentication.</li>
              <li><span className="font-medium text-gray-900 dark:text-white">Performance:</span> help us understand site usage and improve user experience.</li>
              <li><span className="font-medium text-gray-900 dark:text-white">Personalization:</span> remember your preferences such as currency, language, and recently viewed products.</li>
              <li><span className="font-medium text-gray-900 dark:text-white">Marketing:</span> deliver relevant content and measure campaign effectiveness (if enabled).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Managing cookies</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              You can control and manage cookies through your browser settings. Blocking certain cookies may impact site
              functionality, including your ability to sign in or complete purchases.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              For more information, see our <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Updates</h2>
            <p className="text-gray-600 dark:text-gray-400">
              We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated date.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
