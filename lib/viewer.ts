export function getViewerId() {
  if (typeof window === "undefined") return null;

  let id = localStorage.getItem("viewerId");

  if (!id) {
    id = `anon-${crypto.randomUUID()}`;
    localStorage.setItem("viewerId", id);
  }

  return id;
}
