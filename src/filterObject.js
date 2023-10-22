export default function filterObject(o) {
  return Object.fromEntries(
    Object.entries(o).filter(
      ([k, v]) => v !== undefined
    )
  );
}

