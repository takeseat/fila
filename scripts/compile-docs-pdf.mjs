#!/usr/bin/env node

/**
 * compile-docs-pdf.mjs
 *
 * Compiles every Markdown file under docs/ into a single, styled PDF.
 * Uses md-to-pdf (Puppeteer under the hood) — no LaTeX dependency.
 *
 * Usage:  node scripts/compile-docs-pdf.mjs
 * Output: docs/TakeSeat-Documentation.pdf
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative, basename, dirname } from "path";
import { mdToPdf } from "md-to-pdf";

const DOCS_DIR = join(import.meta.dirname, "..", "docs");
const OUTPUT_FILE = join(DOCS_DIR, "TakeSeat-Documentation.pdf");

// ── Ordered sections (matches README.md structure) ──────────────────────────
const ORDERED_FILES = [
  "README.md",

  // Product & Design System
  "product/vision.md",
  "product/features.md",
  "design-system/overview.md",
  "design-system/tokens.md",
  "design-system/components.md",
  "design-system/patterns.md",

  // Architecture & Codebase
  "architecture/overview.md",
  "architecture/components.md",
  "backend/backend-architecture.md",
  "backend/api-patterns.md",
  "frontend/frontend-architecture.md",
  "frontend/state-management.md",

  // Business Rules
  "business-rules/queue-rules.md",
  "business-rules/customer-rules.md",
  "business-rules/subscription-rules.md",

  // Database
  "database/schema-overview.md",
  "database/entities/restaurants.md",
  "database/entities/customers.md",
  "database/entities/waitlist_entries.md",
  "database/entities/subscriptions.md",
  "database/entities/users.md",

  // Flows
  "flows/authentication-flow.md",
  "flows/billing-and-trial-flow.md",
  "flows/queue-flow.md",
  "flows/reporting-flow.md",
  "flows/user-management-flow.md",
  "flows/whatsapp-flow.md",

  // Integrations
  "integrations/whatsapp.md",
  "integrations/stripe.md",

  // Decisions
  "decisions/ADR-001-whatsapp-provider.md",
  "decisions/ADR-002-i18n-strategy.md",
  "decisions/ADR-003-multi-tenant-model.md",

  // Operations & Guidelines
  "security/security-overview.md",
  "ai-context/agent-guidelines.md",
  "ai-context/system-context.md",
  "ai-context/domain-glossary.md",
  "setup/local-setup.md",
  "guides/email-service-runbook.md",
  "troubleshooting/troubleshooting-guide.md",
  "reference/api-reference.md",
  "infrastructure/infra-overview.md",
  "infrastructure/deployment.md",
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Recursively collect all .md files under a dir */
function collectMdFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectMdFiles(full));
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

/** Convert a relative path like "business-rules/queue-rules.md" to a readable section title */
function sectionTitle(relPath) {
  const parts = relPath.replace(/\.md$/, "").split("/");
  return parts
    .map((p) =>
      p
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .join(" › ");
}

// ── Build the combined Markdown ─────────────────────────────────────────────

console.log("📖 Collecting documentation files…");

// Start with ordered files, then append any not yet listed
const allMdFiles = collectMdFiles(DOCS_DIR);
const relativeAll = allMdFiles.map((f) => relative(DOCS_DIR, f));
const orderedSet = new Set(ORDERED_FILES);
const extraFiles = relativeAll.filter((f) => !orderedSet.has(f));
const finalOrder = [...ORDERED_FILES.filter((f) => relativeAll.includes(f)), ...extraFiles];

console.log(`   Found ${finalOrder.length} files.`);

// ── Cover page ──────────────────────────────────────────────────────────────
let combined = `
<div class="cover-page">
  <div class="cover-content">
    <h1 class="cover-title">TakeSeat</h1>
    <p class="cover-subtitle">Technical Documentation</p>
    <hr class="cover-divider" />
    <p class="cover-date">${new Date().toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}</p>
  </div>
</div>

<div style="page-break-after: always;"></div>

`;

// ── Table of Contents ───────────────────────────────────────────────────────
combined += `# Índice\n\n`;
finalOrder.forEach((relPath, i) => {
  combined += `${i + 1}. ${sectionTitle(relPath)}\n`;
});
combined += `\n<div style="page-break-after: always;"></div>\n\n`;

// ── Append each document ────────────────────────────────────────────────────
for (const relPath of finalOrder) {
  const fullPath = join(DOCS_DIR, relPath);
  let content = readFileSync(fullPath, "utf-8");

  // Remove mermaid code blocks (Puppeteer can't render them)
  content = content.replace(/```mermaid[\s\S]*?```/g, "_[Diagrama Mermaid — ver fonte original]_");

  combined += `\n\n---\n\n`;
  combined += `<p class="section-path">📄 docs/${relPath}</p>\n\n`;
  combined += content;
  combined += `\n\n<div style="page-break-after: always;"></div>\n\n`;
}

// ── Generate PDF ────────────────────────────────────────────────────────────
console.log("🖨️  Generating PDF…");

const pdf = await mdToPdf(
  { content: combined },
  {
    dest: OUTPUT_FILE,
    launch_options: {
      args: ["--no-sandbox"],
    },
    pdf_options: {
      format: "A4",
      margin: {
        top: "25mm",
        bottom: "25mm",
        left: "20mm",
        right: "20mm",
      },
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width:100%;font-size:9px;color:#999;padding:0 20mm;display:flex;justify-content:space-between;">
          <span>TakeSeat — Technical Documentation</span>
          <span></span>
        </div>
      `,
      footerTemplate: `
        <div style="width:100%;font-size:9px;color:#999;padding:0 20mm;display:flex;justify-content:center;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
    },
    css: `
      /* ── Base ──────────────────────────────────── */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      :root {
        --color-primary: #C75B39;
        --color-primary-light: #E8A48C;
        --color-bg: #FFFFFF;
        --color-surface: #F8F6F4;
        --color-text: #1A1A1A;
        --color-text-secondary: #6B6B6B;
        --color-border: #E5E0DB;
        --color-code-bg: #F5F2EF;
      }

      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-size: 11pt;
        line-height: 1.65;
        color: var(--color-text);
        background: var(--color-bg);
      }

      /* ── Cover page ────────────────────────────── */
      .cover-page {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        text-align: center;
      }
      .cover-title {
        font-size: 42pt;
        font-weight: 700;
        color: var(--color-primary);
        margin-bottom: 8px;
        letter-spacing: -1px;
      }
      .cover-subtitle {
        font-size: 16pt;
        font-weight: 400;
        color: var(--color-text-secondary);
        margin-bottom: 24px;
      }
      .cover-divider {
        width: 80px;
        border: none;
        border-top: 3px solid var(--color-primary);
        margin: 24px auto;
      }
      .cover-date {
        font-size: 11pt;
        color: var(--color-text-secondary);
      }

      /* ── Section path badge ────────────────────── */
      .section-path {
        display: inline-block;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 4px 12px;
        font-size: 9pt;
        color: var(--color-text-secondary);
        font-family: 'JetBrains Mono', monospace;
        margin-bottom: 8px;
      }

      /* ── Headings ──────────────────────────────── */
      h1 {
        font-size: 22pt;
        font-weight: 700;
        color: var(--color-primary);
        border-bottom: 2px solid var(--color-primary-light);
        padding-bottom: 8px;
        margin-top: 32px;
      }
      h2 {
        font-size: 16pt;
        font-weight: 600;
        color: var(--color-text);
        margin-top: 24px;
        border-bottom: 1px solid var(--color-border);
        padding-bottom: 4px;
      }
      h3 {
        font-size: 13pt;
        font-weight: 600;
        color: var(--color-text);
        margin-top: 16px;
      }
      h4, h5, h6 {
        font-size: 11pt;
        font-weight: 600;
        color: var(--color-text-secondary);
        margin-top: 12px;
      }

      /* ── Code ───────────────────────────────────── */
      code {
        font-family: 'JetBrains Mono', monospace;
        font-size: 9.5pt;
        background: var(--color-code-bg);
        padding: 2px 5px;
        border-radius: 4px;
        color: var(--color-primary);
      }
      pre {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: 14px 18px;
        overflow-x: auto;
        font-size: 9pt;
        line-height: 1.5;
      }
      pre code {
        background: none;
        padding: 0;
        color: var(--color-text);
      }

      /* ── Tables ─────────────────────────────────── */
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 10pt;
      }
      th {
        background: var(--color-surface);
        font-weight: 600;
        text-align: left;
        padding: 10px 12px;
        border-bottom: 2px solid var(--color-primary-light);
      }
      td {
        padding: 8px 12px;
        border-bottom: 1px solid var(--color-border);
      }
      tr:nth-child(even) td {
        background: var(--color-surface);
      }

      /* ── Blockquotes ────────────────────────────── */
      blockquote {
        border-left: 4px solid var(--color-primary-light);
        margin: 16px 0;
        padding: 8px 16px;
        background: var(--color-surface);
        border-radius: 0 8px 8px 0;
        color: var(--color-text-secondary);
      }

      /* ── Horizontal Rules ──────────────────────── */
      hr {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 32px 0;
      }

      /* ── Lists ──────────────────────────────────── */
      ul, ol {
        padding-left: 24px;
      }
      li {
        margin-bottom: 4px;
      }

      /* ── Links ──────────────────────────────────── */
      a {
        color: var(--color-primary);
        text-decoration: none;
      }

      /* ── Images ─────────────────────────────────── */
      img {
        max-width: 100%;
        border-radius: 8px;
        margin: 12px 0;
      }
    `,
  }
);

if (pdf) {
  console.log(`✅ PDF generated: ${OUTPUT_FILE}`);
  console.log(`   Size: ${(pdf.content.length / 1024).toFixed(0)} KB`);
} else {
  console.error("❌ Failed to generate PDF.");
  process.exit(1);
}
