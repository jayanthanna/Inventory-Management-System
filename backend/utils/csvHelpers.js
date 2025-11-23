function productsToCsv(products) {
  const headers = [
    "name",
    "unit",
    "category",
    "brand",
    "stock",
    "status",
    "image",
  ];
  const lines = [headers.join(",")];

  products.forEach((p) => {
    lines.push(
      [
        escapeCsv(p.name),
        escapeCsv(p.unit || ""),
        escapeCsv(p.category || ""),
        escapeCsv(p.brand || ""),
        p.stock,
        escapeCsv(p.status || ""),
        escapeCsv(p.image || ""),
      ].join(",")
    );
  });

  return lines.join("\n");
}

function escapeCsv(value) {
  const v = String(value);
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

module.exports = { productsToCsv };
