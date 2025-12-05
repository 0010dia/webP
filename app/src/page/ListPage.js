import React, { useMemo, useState } from "react";

function ListPage() {
  const fixedGenderLabel = "남성";
  const [activeCat, setActiveCat] = useState("shoes"); // shoes/new/lifestyle/sale/slim

  // ✅ 추가: 선택된 사이즈 / 소재 상태
  const [selectedSizes, setSelectedSizes] = useState([]); // number[]
  const [selectedMaterials, setSelectedMaterials] = useState([]); // string[]

  const categories = [
    { key: "new", label: "신제품" },
    { key: "active", label: "액티브" },
    { key: "lifestyle", label: "라이프스타일" },
    { key: "sale", label: "세일" },
    { key: "slim", label: "슬립온" },
    { key: "slipper", label: "슬리퍼" },
  ];

  // 카테고리별 설명 문구
  const descByCat = {
    shoes:
      "Wool, Tree, Sugar 등 자연 소재로 만들어 놀랍도록 편안한 올버즈 제품을 만나보세요. 우리는 편안한 신발의 기준을 만들어가고 있습니다.",
    new: "새롭게 출시된 컬렉션으로 만나는 올버즈. 새로운 소재와 디자인을 가장 먼저 경험해보세요.",
    lifestyle:
      "당신의 하루를 함께하는 라이프스타일 신발 컬렉션. 편안한 착화감과 세련된 디자인으로 언제 어디서나 활용할 수 있습니다.",
    slim: "간편하게 신고 벗을 수 있는 슬립온 컬렉션. 편안함과 세련된 무드를 동시에 잡고 싶다면 가장 손쉬운 선택입니다.",
  };

  const isSale = activeCat === "sale";

  const title = useMemo(() => {
    if (isSale) return "";
    const catLabel =
      activeCat === "shoes" || activeCat == null
        ? "신발"
        : categories.find((c) => c.key === activeCat)?.label ?? "신발";
    return `${fixedGenderLabel} ${catLabel}`;
  }, [activeCat, categories, isSale]);

  const desc = useMemo(() => {
    if (isSale) return "";
    return descByCat[activeCat] ?? descByCat.shoes;
  }, [activeCat, isSale]);

  // ================== 필터용 목업 데이터 ==================
  const sizeOptions = [
    [220, 230, 240],
    [250, 255, 260],
    [265, 270, 275],
    [280, 285, 290],
    [295, 300, 305],
    [310, 315, 320],
  ];

  const materials = [
    "가볍고 시원한 tree",
    "면",
    "부드럽고 따뜻한 wool",
    "캔버스",
    "플라스틱 제로 식물성 가죽",
  ];

  // 상품 데이터 (이미지 경로는 public/img 기준)
  const products = [
    {
      id: 1,
      image: "/img/1.avif",
      name: "남성 울 크루저",
      meta: "캐주얼, 가벼운 산책, 클래식 스니커즈",
      price: 170000,
      badge: null,
      isOnSale: false,
    },
    {
      id: 2,
      image: "/img/2.avif",
      name: "남성 울 크루저 슬립온",
      meta: "슬립온, 라이프스타일, 캐주얼",
      price: 170000,
      badge: null,
      isOnSale: false,
    },
    {
      id: 3,
      image: "/img/3.avif",
      name: "남성 울 러너 NZ",
      meta: "캐주얼, 비즈니스, 클래식 스니커즈",
      price: 150000,
      oldPrice: 170000,
      discountText: "11%",
      badge: "HOLIDAY COLLECTION",
      isOnSale: true,
    },
    {
      id: 4,
      image: "/img/4.avif",
      name: "남성 트리 러너",
      meta: "가볍고 시원한 착화감, 데일리 스니커즈",
      price: 160000,
      badge: null,
      isOnSale: false,
    },
    {
      id: 5,
      image: "/img/5.avif",
      name: "남성 트리 대셔",
      meta: "액티브, 러닝, 트레이닝",
      price: 190000,
      badge: null,
      isOnSale: false,
    },
    {
      id: 6,
      image: "/img/6.avif",
      name: "남성 캔버스 페이서",
      meta: "라이프스타일, 가벼운 외출, 캐주얼",
      price: 165000,
      badge: null,
      isOnSale: false,
    },
  ];

  const formatKRW = (n) => `₩${n.toLocaleString("ko-KR")}`;

  // ================== 필터 선택 / 해제 핸들러 ==================
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleMaterial = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const clearSizeFromChip = (size) => {
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  };

  const clearMaterialFromChip = (material) => {
    setSelectedMaterials((prev) => prev.filter((m) => m !== material));
  };

  const hasAppliedFilters =
    selectedSizes.length > 0 || selectedMaterials.length > 0;

  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        {!isSale && (
          <nav aria-label="Breadcrumb" style={styles.breadcrumb}>
            <a href="#" aria-label="Home" style={styles.crumbHome}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 3l9 8h-3v10h-5v-6H11v6H6V11H3l9-8z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <span aria-hidden="true" style={styles.crumbSep}>
              ›
            </span>
            <a href="#" style={styles.crumbLink}>
              Home
            </a>
            <span aria-hidden="true" style={styles.crumbSep}>
              ›
            </span>
            <span style={styles.crumbCurrent}>남성 전체 상품</span>
          </nav>
        )}

        <br />

        <div role="tablist" aria-label="성별 선택" style={styles.segmented}>
          <button
            type="button"
            role="tab"
            aria-selected={true}
            style={{
              ...styles.segBtn,
              ...styles.segBtnActive,
              cursor: "default",
            }}
            onClick={(e) => e.preventDefault()}
          >
            남성
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={false}
            style={{ ...styles.segBtn, opacity: 0.6 }}
            disabled
          >
            여성
          </button>
        </div>

        {!isSale && (
          <>
            <h1 style={styles.title}>{title}</h1>
            <p style={styles.desc}>{desc}</p>
          </>
        )}

        <div aria-label="카테고리" style={styles.cats}>
          <div style={{ ...styles.chip, ...styles.chipActive }}>
            <span style={styles.chipLabel}>신발</span>
            <button
              type="button"
              aria-label="신발 필터 제거"
              onClick={() => setActiveCat("shoes")}
              style={styles.chipClose}
            >
              ×
            </button>
          </div>

          {categories.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveCat(c.key)}
              style={{
                ...styles.catLink,
                ...(activeCat === c.key ? styles.catLinkActive : null),
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <hr style={styles.divider} />

        {/* ================== HR 아래: 필터 + 상품 리스트 ================== */}
        <section style={styles.listSection}>
          {/* 왼쪽 필터 영역 */}
          <aside style={styles.sidebar} aria-label="필터">
            {/* ✅ 적용된 필터 영역 */}
            {hasAppliedFilters && (
              <div style={styles.appliedSection}>
                <h2 style={styles.filterTitle}>적용된 필터</h2>
                <div style={styles.appliedChips}>
                  {selectedSizes.map((size) => (
                    <button
                      key={`size-${size}`}
                      type="button"
                      style={styles.appliedChip}
                      onClick={() => clearSizeFromChip(size)}
                    >
                      <span>{size}</span>
                      <span style={styles.appliedChipClose}>×</span>
                    </button>
                  ))}
                  {selectedMaterials.map((m) => (
                    <button
                      key={`mat-${m}`}
                      type="button"
                      style={{
                        ...styles.appliedChip,
                        ...styles.appliedChipWide,
                      }}
                      onClick={() => clearMaterialFromChip(m)}
                    >
                      <span>{m}</span>
                      <span style={styles.appliedChipClose}>×</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 사이즈 필터 */}
            <h2 style={styles.filterTitle}>사이즈</h2>
            <div style={styles.sizeGrid}>
              {sizeOptions.map((row, i) => (
                <div key={i} style={styles.sizeRow}>
                  {row.map((sz) => {
                    const active = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        style={{
                          ...styles.sizeBtn,
                          ...(active ? styles.sizeBtnActive : null),
                        }}
                        onClick={() => toggleSize(sz)}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={styles.filterDivider} />

            {/* 소재 필터 */}
            <h2 style={styles.filterTitle}>소재</h2>
            <div style={styles.materialList}>
              {materials.map((m) => {
                const checked = selectedMaterials.includes(m);
                return (
                  <label key={m} style={styles.checkRow}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={checked}
                      onChange={() => toggleMaterial(m)}
                    />
                    <span style={styles.checkLabel}>{m}</span>
                  </label>
                );
              })}
            </div>
          </aside>

          {/* 오른쪽 상품 영역 */}
          <div style={styles.contentArea}>
            <div style={styles.contentTop}>
              <div style={styles.countText}>218개 제품</div>
              <button
                type="button"
                style={styles.iconBtn}
                aria-label="필터/정렬"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            <div style={styles.grid}>
              {products.map((p) => (
                <article key={p.id} style={styles.card}>
                  <div style={styles.imageBox}>
                    {p.badge && <div style={styles.badge}>{p.badge}</div>}
                    <img
                      src={p.image}
                      alt={p.name}
                      style={styles.productImg}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>

                  <div style={styles.thumbRow} aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div key={idx} style={styles.thumb} />
                    ))}
                  </div>

                  <div style={styles.cardBody}>
                    <div style={styles.pName}>{p.name}</div>
                    <div style={styles.pMeta}>{p.meta}</div>

                    {!p.isOnSale ? (
                      <div style={styles.priceRow}>
                        <span style={styles.price}>{formatKRW(p.price)}</span>
                      </div>
                    ) : (
                      <div style={styles.priceRow}>
                        <span style={styles.discount}>{p.discountText}</span>
                        <span style={styles.price}>{formatKRW(p.price)}</span>
                        <span style={styles.oldPrice}>
                          {formatKRW(p.oldPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "24px 18px 80px",
    background: "#f5f5f5",
    color: "#111",
  },
  wrap: { maxWidth: "1180px", margin: "0 auto" },
};

styles.breadcrumb = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  color: "#666",
  fontSize: "13px",
  lineHeight: 1,
  margin: "0 0 28px",
};
styles.crumbHome = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "18px",
  height: "18px",
  color: "#666",
  textDecoration: "none",
};
styles.crumbSep = { opacity: 0.7 };
styles.crumbLink = { color: "#666", textDecoration: "none" };
styles.crumbCurrent = { color: "#666" };

styles.segmented = {
  display: "inline-flex",
  border: "1px solid #212121",
  borderRadius: "4px",
  overflow: "hidden",
  margin: "0 0 46px",
};
styles.segBtn = {
  minWidth: "90px",
  padding: "10px 18px",
  fontSize: "14px",
  border: 0,
  background: "transparent",
  color: "#212121",
};
styles.segBtnActive = { background: "#212121", color: "#fff" };

styles.title = {
  margin: "0 0 18px",
  fontSize: "60px",
  fontWeight: 400,
  letterSpacing: "-0.5px",
};
styles.desc = {
  margin: "0 0 30px",
  fontSize: "24px",
  lineHeight: 1.8,
};

styles.cats = {
  display: "flex",
  alignItems: "center",
  gap: "22px",
  flexWrap: "wrap",
  margin: "10px 0 22px",
};

styles.chip = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 18px",
  border: "1px solid #bdbdbd",
  borderRadius: "3px",
  background: "transparent",
};
styles.chipActive = { borderColor: "#212121" };
styles.chipLabel = { fontSize: "1rem" };
styles.chipClose = {
  border: 0,
  background: "transparent",
  cursor: "pointer",
  fontSize: "16px",
  lineHeight: 1,
  color: "#666",
  padding: 0,
};

styles.catLink = {
  border: 0,
  background: "transparent",
  cursor: "pointer",
  fontSize: "1rem",
  color: "#111",
  padding: "10px 0",
};
styles.catLinkActive = {
  textDecoration: "underline",
  textDecorationThickness: "1px",
  textUnderlineOffset: "6px",
};

styles.divider = {
  border: 0,
  borderTop: "1px solid #212121",
  margin: "10px 0 0",
};

styles.listSection = {
  display: "flex",
  gap: "48px",
  paddingTop: "22px",
};

styles.sidebar = {
  width: "280px",
  flex: "0 0 280px",
};

/* 적용된 필터 */
styles.appliedSection = { marginBottom: "26px" };
styles.appliedChips = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "10px",
};
styles.appliedChip = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  padding: "10px 14px",
  border: "1px solid #212121",
  borderRadius: "3px",
  background: "#fff",
  fontSize: "14px",
  cursor: "pointer",
};

styles.appliedChipClose = {
  fontSize: "14px",
};

styles.filterTitle = {
  margin: "0 0 14px",
  fontSize: "22px",
  fontWeight: 400,
};

styles.sizeGrid = { marginBottom: "22px" };
styles.sizeRow = { display: "flex", gap: "12px", marginBottom: "12px" };
styles.sizeBtn = {
  width: "72px",
  height: "40px",
  border: "1px solid #212121",
  background: "transparent",
  cursor: "pointer",
  fontSize: "14px",
};
styles.sizeBtnActive = {
  background: "#111",
  color: "#fff",
};

styles.filterDivider = {
  height: "40px",
};

styles.materialList = { display: "flex", flexDirection: "column", gap: "12px" };
styles.checkRow = { display: "flex", alignItems: "center", gap: "10px" };
styles.checkbox = { width: "16px", height: "16px" };
styles.checkLabel = { fontSize: "14px" };

styles.contentArea = { flex: 1, minWidth: 0 };

styles.contentTop = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "18px",
};

styles.countText = { fontSize: "14px", color: "#111" };

styles.iconBtn = {
  width: "44px",
  height: "44px",
  border: "1px solid #212121",
  borderRadius: "4px",
  background: "#fff",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#111",
};

styles.grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "28px",
};

styles.card = {
  background: "transparent",
};

styles.imageBox = {
  position: "relative",
  background: "#eaeaea",
  height: "310px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

styles.productImg = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
};

styles.badge = {
  position: "absolute",
  left: "18px",
  bottom: "18px",
  background: "#fff",
  padding: "10px 14px",
  fontSize: "12px",
  letterSpacing: "2px",
  fontWeight: 600,
};

styles.thumbRow = {
  display: "flex",
  gap: "8px",
  padding: "10px 0 0",
};

styles.thumb = {
  width: "44px",
  height: "30px",
  border: "1px solid #ddd",
  background: "#f2f2f2",
};

styles.cardBody = { paddingTop: "14px" };

styles.pName = { fontSize: "14px", fontWeight: 600, marginBottom: "8px" };
styles.pMeta = { fontSize: "13px", color: "#666", marginBottom: "10px" };

styles.priceRow = { display: "flex", alignItems: "baseline", gap: "10px" };
styles.price = { fontSize: "14px", fontWeight: 600 };
styles.oldPrice = {
  fontSize: "12px",
  color: "#8b8b8b",
  textDecoration: "line-through",
};
styles.discount = { fontSize: "12px", color: "#c0392b", fontWeight: 700 };

export default ListPage;
