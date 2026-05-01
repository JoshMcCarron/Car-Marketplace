function CatalogPage({ navigate, onAddToCart }) {
  const [brand, setBrand] = useState("");
  const [shape, setShape] = useState("");
  const [year, setYear] = useState("");
  const [onSale, setOnSale] = useState("");
  const [sortBy, setSortBy] = useState("price");
  const [sortDir, setSortDir] = useState("asc");

  let vehicles = window.MOCK_VEHICLES.slice();
  if (brand) vehicles = vehicles.filter(v => v.brand === brand);
  if (shape) vehicles = vehicles.filter(v => v.shape === shape);
  if (year) vehicles = vehicles.filter(v => v.modelYear === Number(year));
  if (onSale === "true") vehicles = vehicles.filter(v => v.onSale);
  if (onSale === "false") vehicles = vehicles.filter(v => !v.onSale);
  vehicles.sort((a, b) => {
    const av = a[sortBy], bv = b[sortBy];
    return sortDir === "asc" ? av - bv : bv - av;
  });

  const hot = vehicles.filter(v => v.onSale);
  const reg = vehicles.filter(v => !v.onSale);
  const reset = () => { setBrand(""); setShape(""); setYear(""); setOnSale(""); };
  const hasFilters = brand || shape || year || onSale;

  return (
    <div className="container">
      <div className="cat">
        <aside className="filters">
          <h3>Filter & Sort</h3>
          <Field label="Brand">
            <select className="select" value={brand} onChange={e => setBrand(e.target.value)}>
              <option value="">All brands</option>
              {window.BRAND_OPTIONS.map(b => <option key={b}>{b}</option>)}
            </select>
          </Field>
          <Field label="Body Type">
            <select className="select" value={shape} onChange={e => setShape(e.target.value)}>
              <option value="">All types</option>
              {window.SHAPE_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Year">
            <select className="select" value={year} onChange={e => setYear(e.target.value)}>
              <option value="">All years</option>
              {window.YEAR_OPTIONS.map(y => <option key={y}>{y}</option>)}
            </select>
          </Field>
          <Field label="Deals">
            <select className="select" value={onSale} onChange={e => setOnSale(e.target.value)}>
              <option value="">All vehicles</option>
              <option value="true">Hot Deals only</option>
              <option value="false">Regular pricing</option>
            </select>
          </Field>
          <div style={{ height: 1, background: "var(--color-border)", margin: "4px 0" }}/>
          <Field label="Sort by">
            <select className="select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="price">Price</option>
              <option value="modelYear">Year</option>
              <option value="mileage">Mileage</option>
            </select>
          </Field>
          <Button kind="outline" size="sm" onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}>
            {sortDir === "asc" ? "↑ Ascending" : "↓ Descending"}
          </Button>
          <Button kind="ghost" size="sm" onClick={reset}>Reset filters</Button>
        </aside>

        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <h1 className="section-title" style={{ margin: 0 }}>Vehicle Catalog</h1>
            <span style={{ color: "var(--color-fg-3)", fontSize: 14 }}>{vehicles.length} results</span>
          </div>

          {hasFilters && (
            <div className="applied-filters">
              <span className="applied-filters__label">Active:</span>
              {brand && <Chip onRemove={() => setBrand("")}>Brand: {brand}</Chip>}
              {shape && <Chip onRemove={() => setShape("")}>Type: {shape}</Chip>}
              {year && <Chip onRemove={() => setYear("")}>Year: {year}</Chip>}
              {onSale === "true" && <Chip danger onRemove={() => setOnSale("")}>Hot Deals only</Chip>}
              {onSale === "false" && <Chip onRemove={() => setOnSale("")}>Regular pricing</Chip>}
            </div>
          )}

          {hot.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 className="section-title" style={{ color: "var(--color-sale)" }}>🔥 Hot Deals</h2>
              <div className="veh-grid">
                {hot.map(v => <VehCard key={v.id} v={v} navigate={navigate} onAddToCart={onAddToCart} />)}
              </div>
            </div>
          )}

          {reg.length > 0 && (
            <>
              <h2 className="section-title">All Vehicles</h2>
              <div className="veh-grid">
                {reg.map(v => <VehCard key={v.id} v={v} navigate={navigate} onAddToCart={onAddToCart} />)}
              </div>
            </>
          )}

          {vehicles.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--color-fg-2)", marginBottom: 16 }}>No vehicles match your search criteria. Try adjusting your filters.</p>
              <Button kind="dark" onClick={reset}>Reset all filters</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function VehCard({ v, navigate, onAddToCart }) {
  return (
    <div className={`veh-card ${v.onSale ? "veh-card--sale" : ""}`}>
      <div onClick={() => navigate("vehicle", v.id)} style={{ position: "relative" }}>
        <VehicleImage label={`${v.brand} ${v.model}`} />
        {v.onSale && <div className="veh-card__badge"><Badge kind="sale">🔥 Hot Deal</Badge></div>}
      </div>
      <div className="veh-card__body">
        <h3 className="veh-card__title" onClick={() => navigate("vehicle", v.id)}>{v.brand} {v.model}</h3>
        <div className="veh-card__meta">{v.modelYear} · {v.mileage.toLocaleString()} km · {v.shape}</div>
        <div className="veh-card__foot">
          <div>
            {v.onSale ? (
              <>
                <span className="veh-card__price veh-card__price--sale">${v.salePrice.toLocaleString()}</span>
                <span className="veh-card__strike">${v.price.toLocaleString()}</span>
              </>
            ) : (
              <span className="veh-card__price">${v.price.toLocaleString()}</span>
            )}
          </div>
          <Button kind="primary" size="sm" onClick={() => onAddToCart(v)}>Add</Button>
        </div>
      </div>
    </div>
  );
}
window.CatalogPage = CatalogPage;
