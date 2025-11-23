const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(value: string | number | Date) {
  try {
    return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
  } catch {
    return value?.toString() ?? "";
  }
}
