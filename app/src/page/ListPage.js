import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";

function ListPage() {
  const navigate = useNavigate();
  const fixedGenderLabel = "남성";

  const [activeCat, setActiveCat] = useState("shoes"); // shoes/new/lifestyle/sale/slim

  // ✅ 추가: 선택된 사이즈 / 소재 상태
  const [selectedSizes, setSelectedSizes] = useState([]); // number[]
  const [selectedMaterials, setSelectedMaterials] = useState([]); // ['tree', 'wool']

  const [sortOpen, setSortOpen] = useState(false);
  const [sortKey, setSortKey] = useState("recommend");
  // recommend | best | priceAsc | priceDesc | newest

  const sortBtnRef = React.useRef(null);
  const sortPopRef = React.useRef(null);

  const sortOptions = [
    { key: "recommend", label: "추천순" },
    { key: "best", label: "판매순" },
    { key: "priceAsc", label: "가격 낮은 순" },
    { key: "priceDesc", label: "가격 높은 순" },
    { key: "newest", label: "최신 등록 순" },
  ];

  const categories = [
    { key: "new", label: "신제품" },
    { key: "active", label: "액티브" },
    { key: "lifestyle", label: "라이프스타일" },
    { key: "sale", label: "세일" },
    { key: "slipon", label: "슬립온" },
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
    { label: "가볍고 시원한 Tree", value: "tree" },
    { label: "면", value: "sugar" },
    { label: "부드럽고 따뜻한 Wool", value: "wool" },
    { label: "캔버스", value: "canvas" },
  ];

  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [hovered, setHovered] = useState(null); // product or null
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [hoveredId, setHoveredId] = useState(null);

  const onCardEnter = (p) => setHovered(p);
  const onCardLeave = () => setHovered(null);

  // 프리뷰가 커서 근처에 뜨게 (고정 위치)
  const onCardMove = (e) => {
    setHoverPos({ x: e.clientX + 24, y: e.clientY - 20 });
  };

  const formatKRW = (n) => `₩${n.toLocaleString("ko-KR")}`;

  // ================== 필터 선택 / 해제 핸들러 ==================
  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      const next = prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size];

      console.log("selectedSizes next:", next);
      return next;
    });
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

  const apiFilters = useMemo(() => {
    const filters = {};

    // ✅ 카테고리: new/sale는 실제 category가 아니므로 제외
    if (
      activeCat &&
      activeCat !== "shoes" &&
      activeCat !== "new" &&
      activeCat !== "sale"
    ) {
      filters.category = activeCat;
    }

    // 세일
    if (activeCat === "sale") {
      filters.sale = true;
    }

    // 신제품
    if (activeCat === "new") {
      filters.newProduct = true;
    }

    // 소재 (OR)
    if (selectedMaterials.length > 0) {
      filters.material = selectedMaterials.join(",");
    }

    // 사이즈 (OR)
    if (selectedSizes.length > 0) {
      filters.sizes = selectedSizes.join(",");
    }

    return filters;
  }, [activeCat, selectedMaterials, selectedSizes]);

  const hasAppliedFilters =
    selectedSizes.length > 0 || selectedMaterials.length > 0;

  const mappedProducts = useMemo(() => {
    return products.map((p, idx) => {
      const isOnSale = p.isOnSale || p.is_on_sale;
      const discountRate = p.discountRate ?? 0;

      return {
        id: p._id,
        image: p.images?.[0],
        images: p.images ?? [],
        name: p.name,
        meta: p.description,
        price: p.price,
        oldPrice:
          isOnSale && discountRate > 0
            ? Math.round(p.price / (1 - discountRate / 100))
            : null,
        discountText: isOnSale && discountRate > 0 ? `${discountRate}%` : null,
        badge: isOnSale ? "SALE" : null,
        isOnSale,

        sizes: p.sizes ?? [],
        material: p.material,

        // ✅ 정렬용
        createdAt: p.createdAt, // 최신등록순
        salesCount: p.salesCount ?? null, // 판매순 (필드가 있을 때만)
        _idx: idx, // 추천순(원래순서) 유지용
      };
    });
  }, [products]);

  const sortedProducts = useMemo(() => {
    const arr = [...mappedProducts];

    switch (sortKey) {
      case "priceAsc":
        arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "priceDesc":
        arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
        break;
      case "newest":
        arr.sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return tb - ta;
        });
        break;
      case "best":
        // salesCount가 없으면 추천순 유지
        arr.sort((a, b) => (b.salesCount ?? -1) - (a.salesCount ?? -1));
        break;
      case "recommend":
      default:
        arr.sort((a, b) => (a._idx ?? 0) - (b._idx ?? 0));
        break;
    }

    return arr;
  }, [mappedProducts, sortKey]);

  useEffect(() => {
    if (!sortOpen) return;

    const onDown = (e) => {
      const btn = sortBtnRef.current;
      const pop = sortPopRef.current;
      if (!btn || !pop) return;

      if (btn.contains(e.target) || pop.contains(e.target)) return;
      setSortOpen(false);
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [sortOpen]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("API filters:", apiFilters);

      // ✅ 핵심: 필터 바뀌는 순간 기존 상품 제거
      setProducts([]);
      setLoading(true);

      try {
        const data = await getProducts(apiFilters);
        setProducts(data.products || []);
        setTotalCount(data.total ?? 0);
      } catch (e) {
        console.error("상품 조회 실패", e);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [apiFilters]);

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
              {materials.map(({ label, value }) => {
                const checked = selectedMaterials.includes(value);

                return (
                  <label key={value} style={styles.checkRow}>
                    <input
                      type="checkbox"
                      style={styles.checkbox}
                      checked={checked}
                      onChange={() => toggleMaterial(value)}
                    />
                    <span style={styles.checkLabel}>{label}</span>
                  </label>
                );
              })}
            </div>
          </aside>

          {/* 오른쪽 상품 영역 */}
          <div style={styles.contentArea}>
            <div style={styles.contentTop}>
              <div style={styles.countText}>{mappedProducts.length}개 제품</div>
              <div style={styles.sortWrap}>
                <button
                  ref={sortBtnRef}
                  type="button"
                  style={styles.iconBtn}
                  aria-label="필터/정렬"
                  onClick={() => setSortOpen((v) => !v)}
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
                {sortOpen && (
                  <div ref={sortPopRef} style={styles.sortPopup} role="menu">
                    {sortOptions.map((opt) => {
                      const checked = sortKey === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          style={styles.sortRow}
                          onClick={() => {
                            setSortKey(opt.key);
                            setSortOpen(false);
                          }}
                        >
                          <span
                            style={{
                              ...styles.sortRadio,
                              ...(checked ? styles.sortRadioOn : null),
                            }}
                            aria-hidden="true"
                          />
                          <span style={styles.sortLabel}>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            {mappedProducts.length === 0 ? (
              <div style={styles.empty}>
                선택하신 조건에 맞는 상품이 없습니다.
              </div>
            ) : (
              <div style={styles.grid}>
                {sortedProducts.map((p) => (
                  <article
                    key={p.id}
                    style={{
                      ...styles.card,
                      ...(hoveredId === p.id ? styles.cardHover : null),
                    }}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    {hoveredId === p.id && <div style={styles.cardOverlay} />}
                    {/* 기존 카드 내용 */}
                    {/* ✅ 실제 카드 내용은 항상 위에 보이게 */}
                    <div style={styles.cardOverlayContent}>
                      <div style={styles.imageBox}>
                        <img
                          src={p.image}
                          alt={p.name}
                          style={styles.productImg}
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
                            <span style={styles.price}>
                              {formatKRW(p.price)}
                            </span>
                          </div>
                        ) : (
                          <div style={styles.priceRow}>
                            <span style={styles.discount}>
                              {p.discountText}
                            </span>
                            <span style={styles.price}>
                              {formatKRW(p.price)}
                            </span>
                            <span style={styles.oldPrice}>
                              {formatKRW(p.oldPrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ✅ hover일 때만 사이즈 영역 추가 (레이아웃은 카드 내부에서만 늘어남) */}
                      {hoveredId === p.id && (
                        <div style={styles.hoverExtra}>
                          <div style={styles.hoverSizes}>
                            {[
                              220, 230, 240, 250, 255, 260, 265, 270, 275, 280,
                              285, 290, 295, 300, 305, 310, 315, 320,
                            ].map((sz) => {
                              const found = p.sizes?.find((x) => x.size === sz);
                              const available = !!found?.available;

                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  disabled={!available}
                                  style={{
                                    ...styles.hoverSizeBtn,
                                    ...(available
                                      ? styles.hoverSizeBtnOn
                                      : styles.hoverSizeBtnOff),
                                  }}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
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
  overflow: "visible",
};

styles.card = {
  background: "transparent",
  background: "white",
  position: "relative",
  overflow: "visible",
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

// 카드가 hover되면 “떠오르는” 효과
styles.cardHover = {
  position: "relative",
  zIndex: 50,
  background: "#fff",
};

// hover일 때 아래로 확장되는 영역
styles.hoverExtra = { paddingTop: "14px" };

styles.hoverSizes = {
  display: "grid",
  gridTemplateColumns: "repeat(6, 1fr)",
  gap: "8px",
  marginTop: "6px",
};

styles.hoverSizeBtn = {
  height: "34px",
  fontSize: "12px",
  border: "1px solid #ddd",
  background: "#fff",
};

styles.hoverSizeBtnOn = { color: "#111", cursor: "pointer" };

styles.hoverSizeBtnOff = {
  color: "#bbb",
  border: "1px solid #eee",
  background: "#fafafa",
  cursor: "not-allowed",
};

// hover 시 덮는 흰 배경 레이어 (레이아웃 영향 없음)
styles.cardOverlay = {
  position: "absolute",
  top: "-30px",
  left: "-30px",
  right: "-30px",
  bottom: "-30px",
  background: "#fff",
  zIndex: 20,
};

// 오버레이 안의 컨텐츠는 위에
styles.cardOverlayContent = {
  position: "relative",
  zIndex: 21,
};
styles.sortWrap = {
  position: "relative", // ✅ 팝업 absolute 기준점
  display: "inline-block",
};

styles.sortPopup = {
  position: "absolute",
  top: "calc(100% + 8px)", // ✅ 버튼 바로 아래로
  right: "0px", // ✅ 버튼 오른쪽 정렬 유지
  width: "200px",
  background: "#fff",
  border: "1px solid #111",
  borderRadius: "6px",
  padding: "10px 0",
  zIndex: 1000,
};

styles.sortRow = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "10px 14px",
  background: "transparent",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
};

styles.sortRadio = {
  width: "14px",
  height: "14px",
  borderRadius: "999px",
  border: "1.5px solid #111",
  display: "inline-block",
  boxSizing: "border-box",
  position: "relative",
};

styles.sortRadioOn = {
  background: "#111",
  borderColor: "#111",
};

styles.sortLabel = {
  fontSize: "14px",
  fontWeight: 600,
  color: "#111",
};

export default ListPage;
