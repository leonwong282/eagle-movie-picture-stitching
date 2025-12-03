# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) documenting significant architectural decisions made in this project.

## What is an ADR?

An **Architecture Decision Record** (ADR) captures an important architectural decision made along with its context and consequences. ADRs help:

- 📝 Document the "why" behind decisions
- 🔄 Track how the project evolved
- 👥 Onboard new team members faster
- 🔍 Avoid revisiting already-decided topics

## ADR Index

| ID | Title | Status | Date |
|----|-------|--------|------|
| [ADR-0000](./adr-0000-use-adrs.md) | Use ADRs to Document Decisions | Accepted | 2024-01-01 |

<!-- Add new ADRs above this line -->

## Creating a New ADR

1. **Copy the template:**
   ```bash
   cp docs/docs/decisions/adr-template.md docs/docs/decisions/adr-XXXX-short-title.md
   ```

2. **Number your ADR:**
   - Use the next available number (0001, 0002, etc.)
   - Keep numbers sequential

3. **Fill in the template:**
   - Replace placeholders with your content
   - Be concise but thorough

4. **Update this index:**
   - Add a row to the table above

5. **Submit a PR:**
   - ADRs should be reviewed like code

## ADR Statuses

| Status | Meaning |
|--------|---------|
| **Proposed** | Under discussion, not yet decided |
| **Accepted** | Decision made and in effect |
| **Deprecated** | No longer relevant but kept for history |
| **Superseded** | Replaced by a newer ADR |

## When to Write an ADR

Write an ADR when you:

- Choose between multiple architectural approaches
- Make a decision that affects the entire project
- Adopt a new technology or framework
- Change a fundamental project convention
- Decide NOT to do something (these are valuable too!)

## Resources

- [MADR Format](https://adr.github.io/madr/) - The format we use
- [ADR GitHub Organization](https://adr.github.io/) - ADR community resources
- [Documenting Architecture Decisions](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions) - Original blog post by Michael Nygard
