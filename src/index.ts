const TOOL_RULES = {
  web_search:  { safe: true,  reason: "Web search is read-only" },
  web_fetch:   { safe: true,  reason: "URL fetch is read-only" },
  github_read: { safe: true,  reason: "GitHub read is read-only" },
  github_write:{ safe: false, reason: "GitHub write can modify files - needs approval" },
  github_push: { safe: false, reason: "GitHub push can deploy code - needs approval" },
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json" }
});

export default {
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/check" && req.method === "POST") {
      const { tool, input } = await req.json().catch(() => ({}));
      if (!tool) return json({ safe: false, error: "tool required" }, 400);

      const rule = TOOL_RULES[tool];
      if (!rule) return json({ safe: false, reason: `Unknown tool: ${tool}` });

      return json({ safe: rule.safe, reason: rule.reason, tool, input: (input || "").slice(0, 200) });
    }

    if (url.pathname === "/status") {
      return json({ alive: true, version: "1.0.0" });
    }

    return json({ error: "not found" }, 404);
  }
};
