<p align="center">
  <img alt="piku-cat" src="https://kodus.io/wp-content/uploads/2026/06/kodus-thumb-git-scaled.png">
</p>

<h1 align="center">piku-cat</h1>

<p align="center">
   Self-hosted AI code review that runs inside your pull requests — Piku reads the
   diff, applies your rules, and comments like a senior reviewer.
</p>

<p align="center">
   <strong>Fork of <a href="https://github.com/kodustech/kodus-ai">kodustech/kodus-ai</a></strong>
</p>

> **piku-cat is a personal-use fork of [kodustech/kodus-ai](https://github.com/kodustech/kodus-ai) by Kodus Tech.**
> It is not an official Kodus product and is not affiliated with or supported by Kodus Tech.
> The upstream licenses ([`license.md`](./license.md), [`license_ee.md`](./license_ee.md)) continue to
> apply unmodified. See [`NOTICE`](./NOTICE) for what this fork changes and the permission it rests on.
> For the supported product, go upstream: [kodus.io](https://kodus.io) · [docs.kodus.io](https://docs.kodus.io).

<p align="center">
   <a href="http://makeapullrequest.com">
      <img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-welcome-darkgreen.svg?style=shields" />
   </a>
   <a href="https://github.com/kodustech/kodus-ai" target="_blank">
      <img src="https://img.shields.io/github/stars/kodustech/kodus-ai" alt="Github Stars" />
   </a>
   <a href="./license.md">
      <img src="https://img.shields.io/badge/license-AGPLv3-red" alt="License" />
   </a>
</p>

---

<p align="center">
   <a href="https://kodus.io">Website</a> ·
   <a href="https://discord.gg/6WbWrRbsH7">Community</a> ·
   <a href="https://docs.kodus.io">Docs</a> ·
   <a href="https://docs.kodus.io/how_to_use/en/cli/overview">CLI Docs</a> ·
   <strong><a href="https://app.kodus.io">Try Kodus Cloud </a></strong> ·
   <strong><a href="https://docs.kodus.io/how_to_deploy/en/deploy_kodus/generic_vm">Self-Host Guide</a></strong>
</p>

<p align="center">
   🌐
   <a href="./README.md">English</a> ·
   <a href="./README.pt-BR.md">Português (BR)</a> ·
   <a href="./README.es.md">Español</a> ·
   <a href="./README.ja.md">日本語</a> ·
   <a href="./README.zh-CN.md">简体中文</a> ·
   <a href="./README.fr.md">Français</a>
</p>

## Why Teams Choose piku-cat

- **Model Agnostic**: Use Claude, GPT-5, Gemini, Llama, GLM, Kimi or any OpenAI-compatible endpoint.
- **Zero Markup on LLM Costs**: You pay model providers directly. No hidden multipliers.
- **Learns from Your Context**: Piku adapts to your architecture, standards, and workflow.
- **You Set the Rules**: Define custom review rules in plain language.
- **Privacy & Security**: Source code is not used to train models, data is encrypted in transit and at rest, and self-hosted runners are supported. Self-hosted instances send one anonymous heartbeat per day (aggregated counters only — no code, names, or identifiers); opt out with `KODUS_TELEMETRY_DISABLED=true`. See [Anonymous Telemetry](https://docs.kodus.io/how_to_deploy/en/deploy_kodus/telemetry).
- **Native Git Workflow**: Works directly in PRs with GitHub, GitLab, Bitbucket, and Azure Repos.
- **CLI + CI/CD Ready**: Run reviews locally and in pipelines.
- **Operational Impact**: Track technical debt and delivery metrics while keeping review quality high.

## Product Highlights

<details>
  <summary><strong>🔑 Bring Your Own Key</strong></summary>
<br />
Connect your own provider credentials and choose the models behind piku-cat reviews: OpenAI, Anthropic, Google Gemini, Vertex AI, Novita, or any OpenAI-compatible endpoint. Keep billing and usage under your own provider account, without hidden LLM markups.

<br />
<br />

<p align="center">
  <img src="https://kodus.io/wp-content/uploads/2026/06/byok-scaled.png" alt="piku-cat BYOK model provider configuration" width="900">
</p>

</details>

<br />

<details>
  <summary><strong>📈 Token Usage</strong></summary>
<br />
Track token consumption across AI code reviews, understand cost drivers, and keep model spend predictable as adoption grows.

<br />
<br />

<p align="center">
  <img src="https://kodus.io/wp-content/uploads/2026/06/token-usage-scaled.png" alt="piku-cat token usage dashboard" width="900">
</p>

</details>

<br />

<details>
  <summary><strong>⚙️ Piku Rules</strong></summary>
<br />
Piku Rules let teams define review instructions in plain language and apply them across organizations, repositories, paths, or specific review scopes. Piku uses those rules as context when reviewing pull requests, helping enforce architecture decisions, security expectations, testing practices, and repository-specific conventions without relying on reviewers to repeat the same feedback manually.

<br />
<br />

<p align="center">
  <img src="https://kodus.io/wp-content/uploads/2026/06/rules-scaled.png" alt="Piku rules" width="900">
</p>
</details>
<br />
<details>
  <summary><strong>📊 Cockpit</strong></summary>
<br />
Cockpit helps teams measure piku-cat review effectiveness, Piku Rule health, repository health, and delivery metrics across the engineering workflow.

<br />
<br />

<p align="center">
  <img src="https://kodus.io/wp-content/uploads/2026/06/cockpit-kodus-scaled.png" alt="piku-cat Cockpit showing AI code review pipeline health" width="900">
</p>

</details>

<br />

<details>
  <summary><strong>🧩 Piku Issues</strong></summary>
<br />
Automatically track unimplemented suggestions from closed pull requests, manage them by status, severity, category, and repository, and let Piku resolve them when the fix appears in a future PR.
<br />
<br />

<p align="center">
  <img src="https://kodus.io/wp-content/uploads/2026/06/issues-scaled.png" alt="piku-cat Issues dashboard" width="900">
</p>

</details>

<br />
<details>
  <summary><strong>🔎 See Piku reviewing a real pull request</strong></summary>
<br />
Piku does more than summarize diffs. It reviews code with context, flags risks by severity, and suggests concrete fixes directly in the pull request.

<br />
<br />

<p align="center">
  <img
    src="https://kodus.io/wp-content/uploads/2025/12/review-kody-.png"
    alt="Piku detecting a critical IDOR security issue in a pull request review"
    width="700"
  />
</p>

In this example, Piku catches a critical IDOR risk where an `organizationId` query parameter could bypass tenant protection when passed as an array, then suggests an explicit runtime validation before the code is merged.

</details>

## Get Started

Choose the workflow that matches how you want to use piku-cat.

<table>
  <tr>
    <td width="50%">
      <strong>Try Kodus Cloud</strong>
      <br />
      Start reviewing pull requests without managing infrastructure.
      <br />
      <br />
      <a href="https://app.kodus.io/signup">Create a free account</a>
      ·
      <a href="https://kodus.io/pricing">View pricing</a>
    </td>
    <td width="50%">
      <strong>Self-host piku-cat</strong>
      <br />
      Deploy piku-cat on your own infrastructure with control over data, models,
      and runtime configuration.
      <br />
      <br />
      <a href="https://docs.kodus.io/how_to_deploy/en/deploy_kodus/generic_vm">Installation guide</a>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <strong>Use the CLI</strong>
      <br />
      Run AI code reviews from your terminal against a working tree, staged diff,
      branch, or commit.
      <br />
      <br />
      <code>kodus review</code>
      <br />
      <code>kodus review --staged</code>
      <br />
      <code>kodus review --prompt-only</code>
      <br />
      <br />
      <a href="https://docs.kodus.io/how_to_use/en/cli/introduction">CLI overview</a>
      ·
      <a href="https://docs.kodus.io/how_to_use/en/cli/commands">Command reference</a>
      ·
      <a href="https://docs.kodus.io/how_to_use/en/cli/ci_cd">CI/CD</a>
    </td>
    <td width="50%">
      <strong>Contribute Locally</strong>
      <br />
      Run the piku-cat monorepo locally for development across the API, worker,
      webhooks service, web app, and local infrastructure.
      <br />
      <br />
      <code>git clone https://github.com/delogx/piku-cat.git</code>
      <br />
      <code>cd piku-cat</code>
      <br />
      <code>yarn setup</code>
      <br />
      <br />
      <a href="https://docs.kodus.io/how_to_deploy/en/local_quickstart/orchestrator">Local quickstart</a>
    </td>
  </tr>
</table>

## Monorepo Structure

piku-cat is a monorepo with multiple applications, shared domain libraries, and published packages.

```txt
kodus-ai/
├── apps/
│   ├── api/          # NestJS API
│   ├── web/          # Next.js dashboard
│   ├── worker/       # Review execution and queue consumers
│   └── webhooks/     # Git provider webhook ingestion
├── libs/             # Shared NestJS domain modules
├── packages/
│   ├── kodus-flow/   # AI agent orchestration SDK
│   └── kodus-common/ # LLM abstraction package
└── scripts/          # Dev, deploy, benchmark, and automation scripts
```

| Path | Purpose |
| --- | --- |
| `apps/api` | Main NestJS API for authentication, organizations, teams, Piku Rules, integrations, permissions, and code review orchestration. |
| `apps/web` | Next.js web application for the piku-cat dashboard. |
| `apps/worker` | Background service for code review execution, queue processing, suggestion checks, automation jobs, and monitoring tasks. |
| `apps/webhooks` | Webhook ingestion service for GitHub, GitLab, Azure Repos, Bitbucket, and Forgejo events. |
| `libs` | Shared NestJS domain modules used across piku-cat applications. |
| `packages/kodus-flow` | SDK for AI agent orchestration. |
| `packages/kodus-common` | Shared LLM abstraction package for model providers. |

For full setup instructions, follow the [Local Quickstart](https://docs.kodus.io/how_to_deploy/en/local_quickstart/orchestrator).

## Open Source vs. Teams vs. Enterprise

| Feature | <img src="https://kodus.io/wp-content/uploads/2026/06/kody-community2-scaled.webp" alt="Piku Community" width="110" /><br>Community | <img src="https://kodus.io/wp-content/uploads/2026/06/kody-team-scaled.webp" alt="Piku Teams" width="110" /><br>Teams | <img src="https://kodus.io/wp-content/uploads/2026/06/kody-enterprise-scaled.webp" alt="Piku Enterprise" width="110" /><br>Enterprise |
| :--- | :---: | :---: | :---: |
| Price | Free | $10/dev monthly or $8/dev annual (+ tokens/dev) | Custom |
| Hosting | Self-hosted **or** hosted by piku-cat | Hosted by piku-cat | Self-hosted **or** hosted by piku-cat |
| Bring Your Own Key (BYOK) | ✅ | ✅ | ✅ |
| PR usage | Unlimited PRs using your own API key | Unlimited PRs using your own API key | Unlimited PRs using piku-cat AI Tokens API key |
| Users | Unlimited | Unlimited | Unlimited |
| Piku Rules | Up to 10 | Unlimited | Unlimited |
| Active plugins | Up to 3 | Unlimited | Unlimited |
| Piku Learnings and Memory | ✅ | ✅ | ✅ |
| Quality Radar issues | Unlimited | Unlimited | Unlimited |
| Priority queue for Piku Agents | ❌ | ✅ | ✅ |
| Engineering Metrics / Cockpit | ❌ | ✅ | ✅ |
| SSO | ❌ | ❌ | ✅ |
| RBAC + audit logs + analytics | ❌ | ❌ | ✅ |
| Compliance | ❌ | ❌ | SOC 2 |
| Support | Discord Community Support | Discord Community + Email Support | Private Discord + Email + up to 5h/month dedicated onboarding/support |

[Compare all plan →](https://kodus.io/pricing)

## Resources

| Resource | Description |
| --- | --- |
| [Website](https://kodus.io) | Learn more about piku-cat, product capabilities, and pricing. |
| [Documentation](https://docs.kodus.io) | Setup guides, product docs, CLI usage, and self-hosting instructions. |
| [Kodus Cloud](https://app.kodus.io) | Start using piku-cat without managing infrastructure. |
| [Self-Host Guide](https://docs.kodus.io/how_to_deploy/en/deploy_kodus/generic_vm) | Deploy piku-cat in your own environment. |
| [CLI Docs](https://docs.kodus.io/how_to_use/en/cli/overview) | Run AI code reviews locally, in CI/CD, or inside coding agents. |
| [Discord Community](https://discord.gg/6WbWrRbsH7) | Ask questions, get setup help, and talk with the piku-cat team. |
| [Pricing](https://kodus.io/pricing) | Compare Community, Teams, and Enterprise editions. |
| [Schedule a Call](https://cal.com/gabrielmalinosqui/30min) | Talk with the piku-cat team about setup, self-hosting, or enterprise needs. |



## Contributing

<p align="left">
  <img src="https://kodus.io/wp-content/uploads/2026/06/kody-contributing-scaled.png" alt="Piku contributing" width="230" />
</p>

We welcome contributions of all sizes 🧡

Fix a typo, improve the docs, report a bug, suggest a feature, or open a pull request for something you think should exist.

Not sure where to start? Open an issue or join the community. We’re happy to help.
