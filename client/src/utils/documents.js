const DOC_LABELS = {
  RCA: "Insurance",
  ITP: "ITP",
  Rovinieta: "Rovigneta",
};

export function getDocLabel(tip) {
  return DOC_LABELS[tip] || tip;
}

export function findDocument(documents, tip) {
  return documents?.find((d) => d.tip === tip);
}

export function formatExpiryDate(isoDate) {
  if (!isoDate) return "—";
  return new Date(isoDate).toLocaleDateString("ro-RO");
}

export function formatDaysRemaining(days) {
  if (days < 0) return "Expired";
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}
