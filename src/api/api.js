// src/api/api.js
const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:9999").trim();

async function handleResp(resp) {
  const text = await resp.text().catch(() => "");
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch { json = null; }
  if (!resp.ok) {
    const msg = (json && (json.error || json.message)) || text || resp.statusText || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return json ?? {};
}

export async function get(path) {
  const url = API_BASE + path;
  const resp = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });
  return handleResp(resp);
}

export async function post(path, body) {
  const url = API_BASE + path;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include"
  });
  return handleResp(resp);
}

export async function apiWithAuthGet(path) {
  const url = API_BASE + path;
  const token = localStorage.getItem("cyberaware_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(url, { method: "GET", headers, credentials: "include" });
  return handleResp(resp);
}

export async function apiWithAuthPost(path, body) {
  const url = API_BASE + path;
  const token = localStorage.getItem("cyberaware_token");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body), credentials: "include" });
  return handleResp(resp);
}

export default { get, post, apiWithAuthGet, apiWithAuthPost };
