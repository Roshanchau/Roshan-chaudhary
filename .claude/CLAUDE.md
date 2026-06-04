# CLAUDE.md

## Planning & Analysis

- Before writing any code, fully understand the requirement. Restate the goal, identify inputs/outputs, and clarify ambiguities
- Evaluate edge cases, failure scenarios, and race conditions upfront. Handle them in the initial implementation, not as an afterthought
- If a requirement is ambiguous, list assumptions explicitly before proceeding

## Code Standards

- Follow SOLID principles strictly: single responsibility per class/module, open for extension, closed for modification, depend on abstractions
- DRY: extract shared logic into reusable utilities or services. Never duplicate code across files
- Write clean, readable code with meaningful names. Prefer clarity over cleverness
- Keep functions short and focused. If a function exceeds ~30 lines, split it

## Architecture

- Extract all configuration (env vars, constants, feature flags, magic numbers) into dedicated config files and import them. No inline config values
- Separate concerns into distinct layers: routing, controllers/handlers, services, repositories, models
- Use dependency injection where applicable to keep modules testable and decoupled

## API Design

- Follow RESTful conventions: proper HTTP methods, status codes, consistent resource naming
- Validate all inputs at the boundary. Return structured error responses with clear messages
- Version APIs when breaking changes are introduced
- Design endpoints to be idempotent where possible (especially PUT, DELETE, and subscription operations)

## Database

- Normalize schemas to at least 3NF unless there is a measured performance reason to denormalize
- Define proper unique constraints, foreign keys, and NOT NULL constraints at the schema level
- Add indexes only where query patterns justify them. Do not over-index
- Use migrations for all schema changes. Never modify production schemas manually

## Concurrency & Resilience

- Ensure thread safety for shared state. Use locks, queues, or atomic operations as appropriate
- Design subscription handlers and webhook processors to be idempotent (safe to retry)
- Handle transient failures with retries and exponential backoff where applicable

## Verification

- Run linting and type checks before considering work done
- Write or update tests for any new logic. Cover the happy path and at least one failure case
- If a test command exists, run it after changes
