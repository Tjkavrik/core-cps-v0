/**
 * Prototype landing page. This V0.1 skeleton establishes the portable
 * foundation (monorepo, database, storage/auth/RBAC abstractions, docs).
 * The primary workflow screens are built in subsequent commits.
 */
export default function Home() {
  return (
    <div>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>
        CORE CPS — Construction Project Services
      </h1>
      <p style={{ color: "#555", marginBottom: 20 }}>
        Discovery prototype (V0.1). This build establishes the portable
        foundation and documentation. It is <strong>not</strong> a production
        system and contains only fictional sample data.
      </p>

      <section style={{ background: "white", border: "1px solid #e2e5ea", borderRadius: 8, padding: 16 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>Foundation status</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li>✅ Monorepo structure (apps/web + packages/database)</li>
          <li>✅ Portable PostgreSQL + Prisma data model & migrations</li>
          <li>✅ Storage / Auth / RBAC abstractions (no proprietary hosting deps)</li>
          <li>✅ Documentation suite, ADRs, and research evidence matrix</li>
          <li>⏳ Project user & CPS operations workflows (next phase)</li>
        </ul>
      </section>

      <p style={{ marginTop: 20, fontSize: 13, color: "#777" }}>
        See <code>/docs</code> for architecture, data model, open questions, and
        Illinois discovery documents.
      </p>
    </div>
  );
}
