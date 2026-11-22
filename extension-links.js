// Count official store-link activations, never extension activity or user files.
(() => {
  const products = {
    pcjkepmfbkfhkpcihebbboocnjinnadi: 'privacyguard',
    opihemepgelanpffiecpodnceboehfcl: 'gifmaker'
  };
  const record = event => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    const anchor = event.target?.closest?.('a[data-extension-id]');
    const id = anchor?.dataset?.extensionId;
    if (!products[id] || anchor.getAttribute('href') !== `https://chromewebstore.google.com/detail/${id}`) return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', 'extension_store_click', {
      extension_product: products[id],
      page_path: window.location.pathname,
      transport_type: 'beacon'
    });
  };
  document.addEventListener('click', record);
  document.addEventListener('auxclick', record);
})();
