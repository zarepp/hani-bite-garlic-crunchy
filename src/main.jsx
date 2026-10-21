import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, CheckCircle2, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import oriImage from '../cheese.png';
import cheeseImage from '../tomato.png';
import saltedEggImage from '../basil.png';
import logoImage from '../logo_hires.png';
import '../styles.css';

const flavors = [
  {
    id: 'ori',
    name: 'Ori',
    image: oriImage,
    description: 'Rasa klasik bawang putih yang ringkas dan memuaskan.',
    price: 12,
  },
  {
    id: 'cheese',
    name: 'Cheese',
    image: cheeseImage,
    description: 'Rasa keju yang lemak bertemu rangup bawang putih.',
    price: 12,
  },
  {
    id: 'salted-egg',
    name: 'Salted Egg',
    image: saltedEggImage,
    description: 'Masin berlemak dengan rasa telur masin yang menyerlah.',
    price: 12,
  },
];

const deliveryFee = 8;
const formatPrice = new Intl.NumberFormat('ms-MY', {
  style: 'currency',
  currency: 'MYR',
}).format;

function useParallax() {
  useEffect(() => {
    const sections = document.querySelectorAll('.hero, .about, .cta');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId = 0;

    function updateParallax() {
      frameId = 0;

      if (reducedMotion.matches) {
        sections.forEach((section) => {
          section.style.removeProperty('--parallax-offset');
        });
        return;
      }

      const viewportCenter = window.innerHeight / 2;

      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();

        if (bounds.bottom > 0 && bounds.top < window.innerHeight) {
          const sectionCenter = bounds.top + bounds.height / 2;
          const offset = (viewportCenter - sectionCenter) * 0.15;
          section.style.setProperty('--parallax-offset', `${offset}px`);
        }
      });
    }

    function requestParallaxUpdate() {
      if (!frameId) {
        frameId = window.requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    window.addEventListener('resize', requestParallaxUpdate);
    reducedMotion.addEventListener('change', requestParallaxUpdate);
    requestParallaxUpdate();

    return () => {
      window.removeEventListener('scroll', requestParallaxUpdate);
      window.removeEventListener('resize', requestParallaxUpdate);
      reducedMotion.removeEventListener('change', requestParallaxUpdate);

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);
}

function IngredientsSection({ onAddToCart }) {
  return (
    <section className="ingredients" aria-labelledby="ingredients-title">
      <div className="ingredients-content">
        <header className="ingredients-heading">
          <p className="ingredients-eyebrow">PILIHAN RASA</p>
          <h2 id="ingredients-title">Cari rangup kegemaran anda.</h2>
          <p>Tiga perisa, satu cara untuk menikmati rangup bawang putih.</p>
        </header>
        <div className="ingredients-list">
          {flavors.map((flavor) => (
            <article className="ingredient" key={flavor.id}>
              <div className="ingredient-media">
                <img src={flavor.image} alt={`Balang Hani Bite perisa ${flavor.name}`} />
              </div>
              <div className="ingredient-copy">
                <h3>{flavor.name}</h3>
                <p>{flavor.description}</p>
                <div className="ingredient-actions">
                  <span className="ingredient-price">{formatPrice(flavor.price)}</span>
                  <button className="add-to-cart" onClick={() => onAddToCart(flavor.id)}>
                    <Plus size={16} aria-hidden="true" />
                    <span>Tambah ke troli</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function App() {
  useParallax();
  const [quantities, setQuantities] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const cartItems = flavors
    .filter((flavor) => quantities[flavor.id] > 0)
    .map((flavor) => ({ ...flavor, quantity: quantities[flavor.id] }));
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const total = subtotal + (itemCount > 0 ? deliveryFee : 0);

  useEffect(() => {
    if (!isCartOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsCartOpen(false);
      }
    }

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isCartOpen]);

  function updateQuantity(id, change) {
    setOrderReceipt(null);
    setQuantities((current) => {
      const next = { ...current };
      const quantity = Math.max(0, (current[id] || 0) + change);

      if (quantity === 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }

      return next;
    });
  }

  function addToCart(id) {
    updateQuantity(id, 1);
    setIsCartOpen(true);
  }

  function submitDemoOrder(event) {
    event.preventDefault();
    const customerName = new FormData(event.currentTarget).get('customerName');

    setOrderReceipt({
      reference: `DEMO-${Date.now().toString().slice(-6)}`,
      customerName,
      itemCount,
      total,
    });
    setQuantities({});
  }

  return (
    <>
      <header className="shop-header">
        <a className="shop-brand" href="#top" aria-label="Hani Bite, ke halaman utama">
          <img className="shop-logo" src={logoImage} alt="Hani Bite" />
        </a>
        <nav className="shop-nav" aria-label="Navigasi utama">
          <a href="#flavors">Pilih perisa</a>
        </nav>
        <button
          className="cart-trigger"
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Buka troli, ${itemCount} item`}
        >
          <ShoppingBag size={18} aria-hidden="true" />
          <span>Troli</span>
          <span className="cart-count" aria-live="polite">{itemCount}</span>
        </button>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-content">
            <h1>Garlic Crunch Sedap</h1>
            <p>Sekali ngap, tak leh stop!</p>
          </div>
        </section>

        <section className="about">
          <div className="content">
            <h2>Tentang Garlic Crunch Kami</h2>
            <p>
              Garlic crunch kami dihasilkan daripada bahan-bahan terbaik, diinspirasikan
              daripada resipi tradisional. Setiap gigitan rangup, keemasan dan penuh dengan
              aroma bawang putih yang kaya. Ia satu citarasa sempurna yang sukar dihentikan
              pada satu gigitan sahaja.
            </p>
          </div>
        </section>

        <div id="flavors">
          <IngredientsSection onAddToCart={addToCart} />
        </div>

        <section className="cta">
          <div className="cta-content">
            <h2>Nak rasa kehebatan Garlic Crunch?</h2>
            <a href="#flavors" className="btn">Pilih perisa sekarang</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2026 HANI BITE CRUNCHY. Hak cipta terpelihara.</p>
          <p>
            Follow us on: <a href="#">Facebook</a> | <a href="#">Instagram</a> |{' '}
            <a href="#">Twitter</a>
          </p>
        </div>
      </footer>

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="cart-heading">
              <div>
                <p className="cart-eyebrow">HANI BITE</p>
                <h2 id="cart-title">Troli anda</h2>
              </div>
              <button
                className="cart-close"
                type="button"
                onClick={() => setIsCartOpen(false)}
                aria-label="Tutup troli"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            {orderReceipt ? (
              <section className="order-success" aria-live="polite">
                <CheckCircle2 size={42} aria-hidden="true" />
                <p className="cart-eyebrow">SELESAI</p>
                <h3>Terima kasih, {orderReceipt.customerName}.</h3>
                <p>Ringkasan demo pesanan anda telah disediakan.</p>
                <dl className="receipt-details">
                  <div><dt>Rujukan</dt><dd>{orderReceipt.reference}</dd></div>
                  <div><dt>Jumlah item</dt><dd>{orderReceipt.itemCount}</dd></div>
                  <div><dt>Jumlah demo</dt><dd>{formatPrice(orderReceipt.total)}</dd></div>
                </dl>
                <p className="checkout-note">
                  Ini hanya demo. Pesanan tidak dihantar dan tiada bayaran diproses.
                </p>
                <button className="checkout-button" type="button" onClick={() => setIsCartOpen(false)}>
                  Kembali ke kedai
                </button>
              </section>
            ) : itemCount === 0 ? (
              <section className="empty-cart">
                <ShoppingBag size={34} aria-hidden="true" />
                <h3>Troli masih kosong</h3>
                <p>Pilih perisa kegemaran anda untuk mula membuat pesanan.</p>
                <button
                  className="checkout-button"
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                >
                  Lihat semua perisa <ArrowRight size={16} aria-hidden="true" />
                </button>
              </section>
            ) : (
              <>
                <div className="cart-items" aria-label="Item dalam troli">
                  {cartItems.map((item) => (
                    <article className="cart-item" key={item.id}>
                      <img src={item.image} alt="" />
                      <div className="cart-item-info">
                        <h3>{item.name}</h3>
                        <p>{formatPrice(item.price)} / balang</p>
                        <div className="quantity-control" aria-label={`Kuantiti ${item.name}`}>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Kurangkan ${item.name}`}
                          >
                            <Minus size={14} aria-hidden="true" />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Tambah ${item.name}`}
                          >
                            <Plus size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <strong>{formatPrice(item.price * item.quantity)}</strong>
                    </article>
                  ))}
                </div>

                <form className="checkout-form" onSubmit={submitDemoOrder}>
                  <h3>Maklumat penghantaran</h3>
                  <label htmlFor="customer-name">Nama penuh</label>
                  <input
                    id="customer-name"
                    name="customerName"
                    autoComplete="name"
                    required
                    maxLength={80}
                  />
                  <label htmlFor="customer-phone">Nombor telefon</label>
                  <input
                    id="customer-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    pattern="[+]?[0-9]{8,15}"
                    title="Masukkan 8 hingga 15 digit, dengan tanda + pilihan di hadapan."
                    required
                  />
                  <label htmlFor="customer-address">Alamat penghantaran</label>
                  <textarea
                    id="customer-address"
                    name="address"
                    autoComplete="street-address"
                    rows={3}
                    minLength={8}
                    required
                  />

                  <div className="order-summary">
                    <div><span>Subtotal ({itemCount} item)</span><strong>{formatPrice(subtotal)}</strong></div>
                    <div><span>Penghantaran</span><strong>{formatPrice(deliveryFee)}</strong></div>
                    <div className="order-total"><span>Jumlah</span><strong>{formatPrice(total)}</strong></div>
                  </div>

                  <button className="checkout-button" type="submit">
                    Hantar pesanan demo <ArrowRight size={16} aria-hidden="true" />
                  </button>
                  <p className="checkout-note">
                    Demo sahaja. Tiada pesanan dihantar atau bayaran diproses.
                  </p>
                </form>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

const root = import.meta.hot?.data.root || createRoot(document.getElementById('root'));

if (import.meta.hot) {
  import.meta.hot.dispose((data) => {
    data.root = root;
  });
}

root.render(<App />);