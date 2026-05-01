import { useState, useRef, useEffect } from "react";

const COLORS = {
  terracotta: "#B85C38",
  gold: "#D4A520",
  indigo: "#2C3E50",
  cream: "#F9F6F0",
  charcoal: "#2A2A2A",
  muted: "#8B7355",
  light: "#EDE8E0",
};

const categories = [
  { id: "all", label: "All Crafts" },
  { id: "madhubani", label: "Madhubani" },
  { id: "terracotta", label: "Terracotta" },
  { id: "sikki", label: "Sikki Grass" },
  { id: "tikuli", label: "Tikuli Art" },
  { id: "tshirt", label: "Craft Tees" },
  { id: "brass", label: "Brass Work" },
  { id: "bamboo", label: "Bamboo" },
];

const products = [
  // Madhubani
  { id: 1, name: "Madhubani Fish Painting", category: "madhubani", price: 1299, badge: "🐟 Madhubani", artisan: "Sunita Devi", village: "Ranti", desc: "Hand-painted on handmade paper with natural pigments. Twin fish motif — symbol of prosperity.", img: /images/painting1.jpg },
  { id: 2, name: "Tree of Life Canvas", category: "madhubani", price: 2499, badge: "🐟 Madhubani", artisan: "Kamla Devi", village: "Jitwarpur", desc: "Large canvas depicting the sacred tree, painted with cow dung base and earth colours.", img: null },
  { id: 3, name: "Ganesha Silk Scroll", category: "madhubani", price: 3199, badge: "✨ Limited Drop", artisan: "Mira Devi", village: "Madhubani", desc: "Silk scroll with intricate Ganesha in Bharni style — bold fills, precise outlines.", img: null },
  { id: 4, name: "Bridal Procession Panel", category: "madhubani", price: 4500, badge: "✨ Limited Drop", artisan: "Sita Devi", village: "Ranti", desc: "Depicts a traditional Bihar bridal procession. Hand-painted, 24×18 inches.", img: null },
  { id: 5, name: "Peacock Diary Cover", category: "madhubani", price: 699, badge: "🐟 Madhubani", artisan: "Anita Jha", village: "Jitwarpur", desc: "A5 journal with Madhubani peacock cover — perfect for the art lover.", img: null },
  { id: 6, name: "Sun & Moon Cushion Cover", category: "madhubani", price: 899, badge: "🐟 Madhubani", artisan: "Geeta Devi", village: "Madhubani", desc: "Cotton cushion cover hand-painted with solar motifs from Mithila tradition.", img: null },
  { id: 7, name: "Kohbar Room Mural Print", category: "madhubani", price: 1599, badge: "🐟 Madhubani", artisan: "Bindu Devi", village: "Ranti", desc: "Classic wedding room (kohbar) mural — lotus, fish, and fertility symbols.", img: null },
  { id: 8, name: "Radha Krishna Triptych", category: "madhubani", price: 5500, badge: "✨ Limited Drop", artisan: "Dulari Devi", village: "Jitwarpur", desc: "Three-panel devotional Madhubani set. National Award artisan's work.", img: null },

  // Terracotta
  { id: 9, name: "Terracotta Ghoda (Horse)", category: "terracotta", price: 849, badge: "☀️ Terracotta", artisan: "Ramesh Kumar", village: "Hajipur", desc: "Ritual horse figurine from the ancient Hajipur tradition. Sun-dried & kiln-fired.", img: null },
  { id: 10, name: "Chhath Diya Set (12 pcs)", category: "terracotta", price: 399, badge: "☀️ Chhath/Terracotta", artisan: "Meena Kumari", village: "Patna", desc: "Hand-formed diyas used in Chhath Puja — made from holy Ganga bank clay.", img: null },
  { id: 11, name: "Terracotta Wall Planter", category: "terracotta", price: 1199, badge: "🌿 Eco-Handmade", artisan: "Vijay Kumar", village: "Hajipur", desc: "Hanging wall planter with geometric cutwork. Ideal for succulents and herbs.", img: null },
  { id: 12, name: "Elephant Family Tableau", category: "terracotta", price: 2299, badge: "☀️ Terracotta", artisan: "Sushila Devi", village: "Nalanda", desc: "Mother elephant with two calves — raw clay, unfired, in the ancient Bihar style.", img: null },
  { id: 13, name: "Terracotta Kulhad Set (6)", category: "terracotta", price: 349, badge: "🌿 Eco-Handmade", artisan: "Gopal Prajapati", village: "Gaya", desc: "Traditional kulhads, wheel-thrown by 4th-generation potter. Zero chemicals.", img: null },
  { id: 14, name: "Surahi Water Vessel", category: "terracotta", price: 799, badge: "🌿 Eco-Handmade", artisan: "Lakshmi Devi", village: "Hajipur", desc: "Porous terracotta surahi — keeps water naturally cool without electricity.", img: null },
  { id: 15, name: "Folk Art Vase (Tall)", category: "terracotta", price: 1499, badge: "☀️ Terracotta", artisan: "Mohan Prajapati", village: "Nalanda", desc: "Hand-incised floral patterns on a 14-inch wheel-thrown vase. Museum-worthy.", img: null },
  { id: 16, name: "Terracotta Wind Chime", category: "terracotta", price: 599, badge: "☀️ Terracotta", artisan: "Puja Devi", village: "Gaya", desc: "Six-piece clay wind chime with hand-painted Madhubani motifs. Soothing tones.", img: null },

  // Sikki Grass
  { id: 17, name: "Sikki Grass Tray", category: "sikki", price: 1099, badge: "🌿 Eco-Handmade", artisan: "Champa Devi", village: "Darbhanga", desc: "Intricately coiled golden grass tray — GI-tagged Mithila craft. Zero plastic.", img: null },
  { id: 18, name: "Sikki Elephant Figurine", category: "sikki", price: 799, badge: "🌿 Eco-Handmade", artisan: "Rekha Devi", village: "Sitamarhi", desc: "Hand-woven elephant from sikki grass. Traditional wedding gift in Mithila homes.", img: null },
  { id: 19, name: "Bridal Basket (Daura-Dauri)", category: "sikki", price: 2499, badge: "✨ Limited Drop", artisan: "Uma Devi", village: "Madhubani", desc: "Traditional pair of wedding baskets — given at Bihari weddings as sacred offerings.", img: null },
  { id: 20, name: "Sikki Wall Art Frame", category: "sikki", price: 1699, badge: "🌿 Eco-Handmade", artisan: "Anita Devi", village: "Darbhanga", desc: "Framed geometric Sikki panel — each motif a different Mithila symbol.", img: null },
  { id: 21, name: "Coil Fruit Bowl", category: "sikki", price: 899, badge: "🌿 Eco-Handmade", artisan: "Savita Devi", village: "Sitamarhi", desc: "Large coil-woven sikki bowl. Structurally sound — holds up to 2kg of fruit.", img: null },
  { id: 22, name: "Sikki Jewelry Box", category: "sikki", price: 1299, badge: "✨ Limited Drop", artisan: "Sunita Kumari", village: "Madhubani", desc: "Lidded jewelry box in golden sikki grass — traditional patterns on lid and sides.", img: null },

  // Tikuli Art
  { id: 23, name: "Tikuli Lacquer Box", category: "tikuli", price: 1499, badge: "✨ Limited Drop", artisan: "Ranjit Kumar", village: "Patna", desc: "Patna's ancient Tikuli art on lacquered wooden box. Gold & glass inlay work.", img: null },
  { id: 24, name: "Tikuli Art Earrings", category: "tikuli", price: 599, badge: "✨ Limited Drop", artisan: "Sunita Singh", village: "Patna", desc: "Wearable Tikuli art — hand-painted glass drops set in brass. Featherlight.", img: null },
  { id: 25, name: "Tikuli Decorative Plate", category: "tikuli", price: 2199, badge: "✨ Limited Drop", artisan: "Arun Kumar", village: "Patna", desc: "12-inch glass plate with Tikuli lacquer painting — Radha-Krishna scene.", img: null },
  { id: 26, name: "Tikuli Photo Frame", category: "tikuli", price: 899, badge: "✨ Limited Drop", artisan: "Priya Rani", village: "Patna", desc: "Hand-lacquered wooden frame with Tikuli floral inlay. 5×7 photo size.", img: null },
  { id: 27, name: "Tikuli Pen Stand", category: "tikuli", price: 749, badge: "✨ Limited Drop", artisan: "Amit Kumar", village: "Patna", desc: "Office-ready Tikuli art pen stand. Makes every desk a gallery.", img: null },

  // Craft Tees
  { id: 28, name: "Madhubani Fish Tee", category: "tshirt", price: 999, badge: "🐟 Madhubani", artisan: "Kalaacart Studio", village: "Patna", desc: "100% organic cotton. Hand block-printed with Madhubani twin fish motif. Unisex.", img: "./public/mockup/tshirt1.jpg" },
  { id: 29, name: "Bihar Pride Tee", category: "tshirt", price: 999, badge: "🌿 Eco-Handmade", artisan: "Kalaacart Studio", village: "Patna", desc: "Soft organic tee with 'Bihar — Where India Begins' in Devanagari script.", img: "./public/mockup/tshirt1.jpg" },
  { id: 30, name: "Chhath Ghat Tee", category: "tshirt", price: 1099, badge: "☀️ Chhath/Terracotta", artisan: "Kalaacart Studio", village: "Patna", desc: "Sunset silhouette of Chhath devotees. Screen-printed on natural ecru cotton.", img: "./public/mockup/tshirt1.jpg" },
  { id: 31, name: "Peacock Heritage Tee", category: "tshirt", price: 999, badge: "🐟 Madhubani", artisan: "Kalaacart Studio", village: "Patna", desc: "Madhubani peacock in natural indigo ink. Limited print run of 100 pieces.", img: "./public/mockup/tshirt1.jpg" },
  { id: 32, name: "Tree of Life Hoodie", category: "tshirt", price: 1799, badge: "✨ Limited Drop", artisan: "Kalaacart Studio", village: "Patna", desc: "Winter-ready unisex hoodie with Madhubani tree embroidered on chest.", img: "./public/mockup/tshirt1.jpg" },
  { id: 33, name: "Ganesha Tote + Tee Bundle", category: "tshirt", price: 1499, badge: "✨ Limited Drop", artisan: "Kalaacart Studio", village: "Patna", desc: "Matching tote and tee with Tikuli-inspired Ganesha illustration. Gift-ready.", img: "./public/mockup/tshirt1.jpg" },

  // Brass Work
  { id: 34, name: "Brass Dhokra Deer", category: "brass", price: 2499, badge: "✨ Limited Drop", artisan: "Ramesh Soni", village: "Bhagalpur", desc: "Lost-wax cast brass deer figurine. 5,000-year-old Dhokra technique.", img: null },
  { id: 35, name: "Brass Diyas (Set of 4)", category: "brass", price: 1299, badge: "☀️ Chhath/Terracotta", artisan: "Santosh Kumar", village: "Patna", desc: "Hand-turned brass diyas with engraved sun motif. For puja & décor.", img: null },
  { id: 36, name: "Tribal Brass Necklace", category: "brass", price: 1899, badge: "✨ Limited Drop", artisan: "Kiran Devi", village: "Bhagalpur", desc: "Dhokra-cast geometric pendant necklace. Bold tribal aesthetic.", img: null },
  { id: 37, name: "Brass Ganesha Idol (6 inch)", category: "brass", price: 3499, badge: "✨ Limited Drop", artisan: "Dinesh Soni", village: "Nalanda", desc: "Solid brass Ganesha, hand-finished. Auspicious gift for home or office.", img: null },
  { id: 38, name: "Brass Dokra Wall Mask", category: "brass", price: 4200, badge: "✨ Limited Drop", artisan: "Anita Soni", village: "Bhagalpur", desc: "Tribal face mask in Dhokra brass. Statement wall art piece — 8 inch diameter.", img: null },
  { id: 39, name: "Brass Tray with Handles", category: "brass", price: 2100, badge: "☀️ Chhath/Terracotta", artisan: "Suresh Kumar", village: "Gaya", desc: "Pooja thali tray with floral engravings and two solid handles. Heirloom quality.", img: null },

  // Bamboo
  { id: 40, name: "Bamboo Lamp Shade", category: "bamboo", price: 1599, badge: "🌿 Eco-Handmade", artisan: "Suresh Mahato", village: "Muzaffarpur", desc: "Woven bamboo pendant lampshade. Casts geometric shadows when lit. Ethereal.", img: null },
  { id: 41, name: "Bamboo Serving Tray", category: "bamboo", price: 799, badge: "🌿 Eco-Handmade", artisan: "Anand Mahato", village: "Darbhanga", desc: "Flat-weave bamboo tray with raised handles. Food-safe lacquer finish.", img: null },
  { id: 42, name: "Bamboo Photo Frame Set (3)", category: "bamboo", price: 999, badge: "🌿 Eco-Handmade", artisan: "Kavita Devi", village: "Muzaffarpur", desc: "Nesting set of 3 bamboo frames. 4×6, 5×7, 8×10. Natural grain. Zero nails.", img: null },
  { id: 43, name: "Bamboo Wind Chime", category: "bamboo", price: 449, badge: "🌿 Eco-Handmade", artisan: "Rohit Mahato", village: "Sitamarhi", desc: "7-pipe bamboo wind chime. Deep, resonant tone. Naturally treated bamboo.", img: null },
  { id: 44, name: "Bamboo Pen Holder", category: "bamboo", price: 349, badge: "🌿 Eco-Handmade", artisan: "Pooja Mahato", village: "Darbhanga", desc: "Triple-cylinder bamboo desk organizer. Clean, modern, biodegradable.", img: null },
  { id: 45, name: "Woven Bamboo Basket (Large)", category: "bamboo", price: 1199, badge: "🌿 Eco-Handmade", artisan: "Bhola Mahato", village: "Muzaffarpur", desc: "Extra-large storage basket in diagonal weave. Holds laundry, toys, or firewood.", img: null },
  { id: 46, name: "Bamboo Coaster Set (6)", category: "bamboo", price: 599, badge: "🌿 Eco-Handmade", artisan: "Meena Mahato", village: "Sitamarhi", desc: "Six interlocked bamboo coasters with holder. Each one unique in natural tone.", img: null },

  // Additional cross-category items
  { id: 47, name: "Sujani Embroidery Throw", category: "madhubani", price: 3299, badge: "✨ Limited Drop", artisan: "Jamuna Devi", village: "Bhusura", desc: "Kantha-style layered throw with Sujani embroidery — hand-stitched Bihar heirloom.", img: null },
  { id: 48, name: "Manjusha Art Scroll", category: "madhubani", price: 1899, badge: "🐟 Madhubani", artisan: "Priti Kumari", village: "Bhagalpur", desc: "Bhagalpur's Manjusha scroll art — serpentine borders, bold folk illustrations.", img: null },
  { id: 49, name: "Terracotta Incense Holder", category: "terracotta", price: 299, badge: "🌿 Eco-Handmade", artisan: "Guddi Devi", village: "Gaya", desc: "Hand-pinched incense stick holder in Bodhi leaf shape. Fired in wood kiln.", img: null },
  { id: 50, name: "Brass Dokra Comb", category: "brass", price: 899, badge: "✨ Limited Drop", artisan: "Lalita Soni", village: "Bhagalpur", desc: "Wearable Dhokra art — hand-cast brass comb with tribal motif handle.", img: null },
  { id: 51, name: "Sikki Grass Earrings", category: "sikki", price: 349, badge: "🌿 Eco-Handmade", artisan: "Neha Devi", village: "Darbhanga", desc: "Feather-light handwoven sikki grass drop earrings in natural gold tone.", img: null },
  { id: 52, name: "Madhubani Phone Case", category: "madhubani", price: 549, badge: "🐟 Madhubani", artisan: "Kalaacart Studio", village: "Patna", desc: "Hand-printed Madhubani motif on slim hard case. Available for major models.", img: null },
];

const badgeColors = {
  "🐟 Madhubani": { bg: "#FFF3E8", text: "#B85C38", border: "#F4C9A8" },
  "☀️ Chhath/Terracotta": { bg: "#FFF8E1", text: "#B8860B", border: "#F5DFA0" },
  "🌿 Eco-Handmade": { bg: "#EDFAF0", text: "#2D6A4F", border: "#A8D5B5" },
  "✨ Limited Drop": { bg: "#F0EBF8", text: "#5E3A87", border: "#C9AEE8" },
  "☀️ Terracotta": { bg: "#FFF8E1", text: "#B8860B", border: "#F5DFA0" },
};

function ProductCard({ product, onClick }) {
  const [hovered, setHovered] = useState(false);
  const badge = badgeColors[product.badge] || badgeColors["🌿 Eco-Handmade"];

  const PatternSVG = () => (
    <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, opacity: 0.07 }}>
      {[0, 1, 2, 3, 4].map(row =>
        [0, 1, 2, 3, 4].map(col => (
          <ellipse key={`${row}-${col}`} cx={20 + col * 40} cy={20 + row * 40} rx="14" ry="9" fill="none" stroke={COLORS.terracotta} strokeWidth="1.5" />
        ))
      )}
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1={0} y1={50 + i * 50} x2={200} y2={50 + i * 50} stroke={COLORS.gold} strokeWidth="0.5" strokeDasharray="4 8" />
      ))}
    </svg>
  );

  return (
    <div
      onClick={() => onClick(product)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        minWidth: 240,
        maxWidth: 240,
        background: COLORS.cream,
        border: `1.5px solid ${hovered ? COLORS.terracotta : "#E2D9CC"}`,
        borderRadius: 2,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px rgba(184,92,56,0.15)` : "0 2px 8px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Image / Illustration area */}
      <div style={{ height: 200, background: `linear-gradient(135deg, ${COLORS.light} 0%, #EEE6D8 100%)`, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <PatternSVG />
        {product.img ? (
          <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0, zIndex: 1 }} onError={e => { e.target.style.display = "none"; }} />
        ) : (
          <div style={{ zIndex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{product.badge.split(" ")[0]}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.08em", textTransform: "uppercase" }}>{product.village}, Bihar</div>
          </div>
        )}
        {/* Gold top line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${COLORS.terracotta}, ${COLORS.gold})`, zIndex: 2 }} />
      </div>

      <div style={{ padding: "16px 18px 20px" }}>
        {/* Badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, borderRadius: 2, padding: "2px 8px", fontSize: 10, fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 10 }}>
          {product.badge}
        </div>

        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: COLORS.charcoal, lineHeight: 1.3, marginBottom: 6 }}>
          {product.name}
        </div>
        <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: "'Manrope', sans-serif", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.desc}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700, color: COLORS.terracotta }}>₹{product.price.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "'Manrope', sans-serif" }}>by {product.artisan}</div>
          </div>
          <button
            style={{
              background: hovered ? COLORS.terracotta : "transparent",
              color: hovered ? "#fff" : COLORS.terracotta,
              border: `1.5px solid ${COLORS.terracotta}`,
              borderRadius: 2,
              padding: "6px 14px",
              fontSize: 11,
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.05em",
            }}
            onClick={e => { e.stopPropagation(); }}
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}

function Modal({ product, onClose }) {
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!product) return null;
  const badge = badgeColors[product.badge] || badgeColors["🌿 Eco-Handmade"];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(42,42,42,0.7)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: COLORS.cream, maxWidth: 560, width: "100%", borderRadius: 2, border: `1.5px solid ${COLORS.terracotta}`, overflow: "hidden", position: "relative" }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${COLORS.terracotta}, ${COLORS.gold}, ${COLORS.indigo})` }} />
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.muted, zIndex: 2 }}>✕</button>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 220, background: `linear-gradient(135deg, ${COLORS.light}, #EEE6D8)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            {product.img ? (
              <img src={product.img} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 56 }}>{product.badge.split(" ")[0]}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "'Cormorant Garamond', Georgia, serif", letterSpacing: "0.1em" }}>HANDCRAFTED IN {product.village.toUpperCase()}</div>
              </div>
            )}
          </div>

          <div style={{ padding: "28px 32px 32px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", background: badge.bg, color: badge.text, border: `1px solid ${badge.border}`, borderRadius: 2, padding: "3px 10px", fontSize: 11, fontFamily: "'Manrope', sans-serif", fontWeight: 600, marginBottom: 14 }}>
              {product.badge}
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 700, color: COLORS.charcoal, margin: "0 0 10px" }}>{product.name}</h2>
            <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.7, margin: "0 0 20px" }}>{product.desc}</p>

            <div style={{ display: "flex", gap: 24, marginBottom: 24, padding: "14px 0", borderTop: `1px solid #E2D9CC`, borderBottom: `1px solid #E2D9CC` }}>
              {[["Artisan", product.artisan], ["Village", product.village], ["Tradition", "GI Tagged"]].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 10, color: COLORS.muted, fontFamily: "'Manrope', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, color: COLORS.charcoal, fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 700, color: COLORS.terracotta }}>₹{product.price.toLocaleString()}</div>
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ background: "transparent", color: COLORS.terracotta, border: `1.5px solid ${COLORS.terracotta}`, borderRadius: 2, padding: "10px 20px", fontSize: 12, fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>WISHLIST</button>
                <button style={{ background: COLORS.terracotta, color: "#fff", border: "none", borderRadius: 2, padding: "10px 24px", fontSize: 12, fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.06em" }}>ADD TO CART</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalSection({ title, subtitle, items, onProductClick }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    setCanLeft(scrollRef.current.scrollLeft > 0);
    setCanRight(scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10);
  };

  const scroll = dir => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section style={{ marginBottom: 60 }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 40px", marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>{subtitle}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: COLORS.charcoal, margin: 0, lineHeight: 1.1 }}>{title}</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ dir: -1, show: canLeft, label: "←" }, { dir: 1, show: canRight, label: "→" }].map(({ dir, show, label }) => (
            <button key={dir} onClick={() => scroll(dir)} style={{ width: 36, height: 36, borderRadius: 2, border: `1.5px solid ${show ? COLORS.terracotta : "#E2D9CC"}`, background: "transparent", color: show ? COLORS.terracotta : "#E2D9CC", fontSize: 16, cursor: show ? "pointer" : "default", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div ref={scrollRef} onScroll={checkScroll} style={{ display: "flex", gap: 20, overflowX: "auto", padding: "8px 40px 20px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {items.map(p => <ProductCard key={p.id} product={p} onClick={onProductClick} />)}
      </div>
    </section>
  );
}

export default function Kalaacart() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef(null);

  const filtered = activeCategory === "all" ? products : products.filter(p => p.category === activeCategory);

  const madhubaniItems = products.filter(p => p.category === "madhubani");
  const terracottaItems = products.filter(p => p.category === "terracotta");
  const tshirtItems = products.filter(p => p.category === "tshirt");
  const ecoItems = products.filter(p => ["sikki", "bamboo"].includes(p.category));
  const limitedItems = products.filter(p => p.badge.includes("Limited"));

  // Decorative SVG kalaash/sun
  const KalaashMark = ({ size = 48, color = COLORS.terracotta, opacity = 1 }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      <circle cx="24" cy="20" r="10" stroke={color} strokeWidth="1.5" fill="none" />
      <ellipse cx="24" cy="30" rx="14" ry="6" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="20" y="36" width="8" height="4" rx="1" stroke={color} strokeWidth="1.5" fill="none" />
      <rect x="16" y="40" width="16" height="2" rx="1" fill={color} opacity="0.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={i} x1={24 + 12 * Math.cos(rad)} y1={20 + 12 * Math.sin(rad)} x2={24 + 16 * Math.cos(rad)} y2={20 + 16 * Math.sin(rad)} stroke={color} strokeWidth="1" />;
      })}
    </svg>
  );

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#FAF7F3", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform: translateX(-20px); } to { opacity:1; transform: translateX(0); } }
        @keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        .hero-word { animation: fadeUp 0.8s ease both; }
        .hero-word:nth-child(1) { animation-delay: 0.1s; }
        .hero-word:nth-child(2) { animation-delay: 0.25s; }
        .hero-word:nth-child(3) { animation-delay: 0.4s; }
        .cat-btn:hover { background: ${COLORS.terracotta} !important; color: #fff !important; }
        @media (max-width: 640px) {
          .hero-title { font-size: 36px !important; }
          .hero-subtitle { font-size: 14px !important; }
          .hero-pad { padding: 0 20px !important; }
          .section-pad { padding: 0 20px !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* ─── ANNOUNCEMENT BAR ─── */}
      <div style={{ background: COLORS.indigo, color: COLORS.cream, textAlign: "center", padding: "8px 20px", fontSize: 11, fontFamily: "'Manrope', sans-serif", letterSpacing: "0.1em" }}>
        🚚 FREE SHIPPING ON ORDERS ABOVE ₹999 &nbsp;|&nbsp; 🏺 100% AUTHENTIC BIHAR CRAFTS &nbsp;|&nbsp; ✨ ARTISAN-FIRST PLATFORM
      </div>

      {/* ─── HEADER / NAV ─── */}
      <header style={{ background: COLORS.cream, borderBottom: `1px solid #E2D9CC`, position: "sticky", top: 0, zIndex: 100, padding: "0 40px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <KalaashMark size={36} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: COLORS.charcoal, lineHeight: 1, letterSpacing: "-0.01em" }}>
                Kalaa<span style={{ color: COLORS.terracotta }}>cart</span>
              </div>
              <div style={{ fontSize: 9, color: COLORS.muted, letterSpacing: "0.12em", textTransform: "uppercase" }}>Bihar's Heritage Store</div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="nav-links" style={{ display: "flex", gap: 32 }}>
            {["Collections", "Artisans", "About Bihar", "Gift Guide"].map(l => (
              <a key={l} href="#" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 12, color: COLORS.charcoal, textDecoration: "none", letterSpacing: "0.06em", fontWeight: 500, transition: "color 0.2s" }}
                onMouseOver={e => e.target.style.color = COLORS.terracotta}
                onMouseOut={e => e.target.style.color = COLORS.charcoal}>{l}</a>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.charcoal }}>🔍</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.charcoal }}>♡</button>
            <button onClick={() => setCartCount(c => c + 1)} style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: 18, color: COLORS.charcoal }}>
              🛒
              {cartCount > 0 && <span style={{ position: "absolute", top: -6, right: -8, background: COLORS.terracotta, color: "#fff", fontSize: 9, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section ref={heroRef} style={{ background: `linear-gradient(160deg, #2C3E50 0%, #1a2a38 60%, #0f1e2a 100%)`, minHeight: 480, display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* Background decorative elements */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {/* Large Kalaash watermark */}
          <div style={{ position: "absolute", right: -40, top: -40, opacity: 0.04 }}>
            <KalaashMark size={400} color={COLORS.gold} opacity={1} />
          </div>
          {/* Fish pattern row */}
          <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.06 }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i =>
              [0, 1, 2, 3, 4].map(j => (
                <ellipse key={`${i}-${j}`} cx={40 + i * 130} cy={40 + j * 100} rx="30" ry="16" fill="none" stroke={COLORS.gold} strokeWidth="1" />
              ))
            )}
          </svg>
          {/* Gold divider lines */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${COLORS.gold}, ${COLORS.terracotta}, transparent)` }} />
        </div>

        <div className="hero-pad" style={{ padding: "80px 40px", maxWidth: 1280, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <div className="hero-word" style={{ fontSize: 11, color: COLORS.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20, fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
            ✦ &nbsp; GI TAGGED CRAFTS FROM BIHAR &nbsp; ✦
          </div>
          <h1 className="hero-title" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 64, fontWeight: 600, color: COLORS.cream, lineHeight: 1.05, marginBottom: 24, maxWidth: 700 }}>
            <span className="hero-word" style={{ display: "block" }}>Where Bihar's</span>
            <span className="hero-word" style={{ display: "block", color: COLORS.gold }}>Heritage</span>
            <span className="hero-word" style={{ display: "block" }}>Meets Your Home.</span>
          </h1>
          <p className="hero-subtitle hero-word" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 15, color: "#A8B8C8", lineHeight: 1.8, maxWidth: 480, marginBottom: 36 }}>
            52 living craft traditions. 200+ artisan families. One curated store — bringing Madhubani, Terracotta, Sikki, Tikuli & more, directly from Bihar's hands to yours.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button style={{ background: COLORS.terracotta, color: "#fff", border: "none", borderRadius: 2, padding: "14px 32px", fontSize: 13, fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.08em", transition: "all 0.2s" }}
              onMouseOver={e => e.currentTarget.style.background = COLORS.gold}
              onMouseOut={e => e.currentTarget.style.background = COLORS.terracotta}>
              EXPLORE CRAFTS
            </button>
            <button style={{ background: "transparent", color: COLORS.cream, border: `1.5px solid rgba(249,246,240,0.3)`, borderRadius: 2, padding: "14px 32px", fontSize: 13, fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.08em" }}>
              MEET ARTISANS →
            </button>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 40, marginTop: 52, flexWrap: "wrap" }}>
            {[["200+", "Artisan Families"], ["52", "Craft Traditions"], ["GI Tagged", "Authentic Crafts"], ["₹0 Middlemen", "Direct Commerce"]].map(([val, label]) => (
              <div key={val}>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 700, color: COLORS.gold }}>{val}</div>
                <div style={{ fontSize: 10, color: "#7A8EA0", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY FILTER ─── */}
      <section style={{ background: COLORS.cream, borderBottom: `1px solid #E2D9CC`, padding: "0 40px", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 4, maxWidth: 1280, margin: "0 auto", padding: "12px 0" }}>
          {categories.map(cat => (
            <button key={cat.id} className="cat-btn" onClick={() => setActiveCategory(cat.id)} style={{
              background: activeCategory === cat.id ? COLORS.terracotta : "transparent",
              color: activeCategory === cat.id ? "#fff" : COLORS.muted,
              border: `1.5px solid ${activeCategory === cat.id ? COLORS.terracotta : "#E2D9CC"}`,
              borderRadius: 2, padding: "7px 18px", fontSize: 11, fontFamily: "'Manrope', sans-serif", fontWeight: 600, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap", letterSpacing: "0.05em"
            }}>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ─── FILTERED GRID (when category selected) ─── */}
      {activeCategory !== "all" && (
        <section style={{ padding: "48px 40px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>
                {filtered.length} Pieces Available
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: COLORS.charcoal }}>{categories.find(c => c.id === activeCategory)?.label} Collection</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onClick={setSelectedProduct} />)}
            </div>
          </div>
        </section>
      )}

      {/* ─── HORIZONTAL SCROLL SECTIONS (all view) ─── */}
      {activeCategory === "all" && (
        <>
          {/* Feature Banner */}
          <div style={{ background: `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.terracotta}10)`, borderTop: `1px solid #E8DDD0`, borderBottom: `1px solid #E8DDD0`, padding: "20px 40px" }}>
            <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", gap: 40, flexWrap: "wrap", justifyContent: "center" }}>
              {[["🏺", "100% Handmade", "No machines, ever"], ["🌿", "Zero Plastic Packing", "Recycled & natural"], ["📖", "Artisan Story Included", "Know who made it"], ["🔁", "Easy Returns", "30-day guarantee"]].map(([icon, title, sub]) => (
                <div key={title} style={{ textAlign: "center", minWidth: 120 }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 12, fontFamily: "'Manrope', sans-serif", fontWeight: 600, color: COLORS.charcoal }}>{title}</div>
                  <div style={{ fontSize: 10, color: COLORS.muted }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ paddingTop: 60 }}>
            <HorizontalSection title="Madhubani Masterworks" subtitle="Mithila's Living Art" items={madhubaniItems} onProductClick={setSelectedProduct} />

            {/* Craft Heritage Banner */}
            <div style={{ margin: "0 40px 60px", background: COLORS.indigo, borderRadius: 2, padding: "40px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, overflow: "hidden", position: "relative" }}>
              <div style={{ position: "absolute", right: -20, opacity: 0.06 }}><KalaashMark size={240} color={COLORS.gold} opacity={1} /></div>
              <div>
                <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Artisan Spotlight</div>
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 600, color: COLORS.cream, maxWidth: 500, lineHeight: 1.2 }}>
                  "Every motif I paint is a prayer. Every fish, a blessing for the home it enters."
                </div>
                <div style={{ fontSize: 12, color: "#7A9BB5", fontFamily: "'Manrope', sans-serif", marginTop: 10 }}>— Dulari Devi, Jitwarpur Village, Madhubani</div>
              </div>
              <button style={{ background: COLORS.gold, color: COLORS.charcoal, border: "none", borderRadius: 2, padding: "14px 28px", fontSize: 12, fontFamily: "'Manrope', sans-serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>MEET ALL ARTISANS</button>
            </div>

            <HorizontalSection title="Earth & Fire — Terracotta" subtitle="Fired in Bihar's ancient kilns" items={terracottaItems} onProductClick={setSelectedProduct} />
            <HorizontalSection title="Limited Drops" subtitle="Rare · One-of-a-kind · Collector Grade" items={limitedItems} onProductClick={setSelectedProduct} />

            {/* Craft Tee Section with image */}
            <HorizontalSection title="Wear the Culture — Craft Tees" subtitle="Bihar on cotton" items={tshirtItems} onProductClick={setSelectedProduct} />

            {/* Eco section */}
            <HorizontalSection title="Sikki Grass & Bamboo" subtitle="Zero plastic. 100% earth." items={ecoItems} onProductClick={setSelectedProduct} />

            {/* Brass */}
            <HorizontalSection title="Dhokra Brass Treasures" subtitle="5,000-year-old lost-wax technique" items={products.filter(p => p.category === "brass")} onProductClick={setSelectedProduct} />

            {/* Tikuli */}
            <HorizontalSection title="Tikuli — Patna's Jewelled Art" subtitle="Glass · Lacquer · Precision" items={products.filter(p => p.category === "tikuli")} onProductClick={setSelectedProduct} />
          </div>
        </>
      )}

      {/* ─── PACKAGING SECTION ─── */}
      {activeCategory === "all" && (
        <section style={{ background: COLORS.light, padding: "72px 40px", marginTop: 20 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 10 }}>The Kalaacart Experience</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 600, color: COLORS.charcoal }}>Unboxing is Part of the Story</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { icon: "📦", title: "Kraft Outer Box", desc: "Terracotta ink-printed with Kalaash logo. 'Made in Bihar. Handcrafted with Soul.'" },
                { icon: "🌸", title: "Madhubani Tissue Wrap", desc: "Cream tissue with subtle fish-scale Madhubani pattern inside." },
                { icon: "🔐", title: "Gold Wax Seal", desc: "Every parcel sealed with our sun-gold wax stamp by hand." },
                { icon: "📖", title: "Artisan Story Card", desc: "Name, village, craft technique + QR to a 30-sec making video." },
                { icon: "💌", title: "Thank You Note", desc: "'You didn't just buy a craft. You kept a tradition alive.'" },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ background: COLORS.cream, border: `1px solid #E2D9CC`, borderRadius: 2, padding: "24px 22px" }}>
                  <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                  <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 600, color: COLORS.charcoal, marginBottom: 8 }}>{title}</div>
                  <div style={{ fontSize: 12, color: COLORS.muted, lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── FOOTER ─── */}
      <footer style={{ background: COLORS.indigo, color: COLORS.cream, padding: "60px 40px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <KalaashMark size={32} color={COLORS.gold} opacity={1} />
                <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, fontWeight: 700 }}>Kalaa<span style={{ color: COLORS.gold }}>cart</span></div>
              </div>
              <div style={{ fontSize: 12, color: "#7A9BB5", lineHeight: 1.8, fontFamily: "'Manrope', sans-serif" }}>Bihar's definitive digital home for handmade craft traditions. Artisan-first. Heritage-forward.</div>
            </div>
            {[
              { h: "Crafts", links: ["Madhubani", "Terracotta", "Sikki Grass", "Tikuli Art", "Brass Work", "Bamboo"] },
              { h: "Company", links: ["About Us", "Meet Artisans", "Craft Stories", "GI Tags", "Press", "Careers"] },
              { h: "Help", links: ["Shipping Info", "Returns", "Track Order", "FAQs", "Contact", "Bulk Orders"] },
            ].map(({ h, links }) => (
              <div key={h}>
                <div style={{ fontSize: 11, color: COLORS.gold, fontFamily: "'Manrope', sans-serif", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>{h}</div>
                {links.map(l => <div key={l} style={{ fontSize: 12, color: "#7A9BB5", fontFamily: "'Manrope', sans-serif", marginBottom: 8, cursor: "pointer" }}>{l}</div>)}
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #3A4F62", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ fontSize: 11, color: "#4A6A82", fontFamily: "'Manrope', sans-serif" }}>© 2026 Kalaacart. All rights reserved. Crafted with ♥ for Bihar.</div>
            <div style={{ display: "flex", gap: 16 }}>
              {["Instagram", "YouTube", "WhatsApp", "Pinterest"].map(s => (
                <div key={s} style={{ fontSize: 11, color: "#4A6A82", cursor: "pointer", fontFamily: "'Manrope', sans-serif" }}>{s}</div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ─── MODAL ─── */}
      {selectedProduct && <Modal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}