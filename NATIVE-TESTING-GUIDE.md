# 🧪 SnakkaZ Native Testing Documentation

## 🔒 Sikker Testing - Ingen Eksterne APIer

SnakkaZ har nå migrert fra TestSprite MCP til native, sikre testverktøy uten eksterne avhengigheter.

## 🛠️ Testverktøy (Native & Secure)

### ✅ Installerte Verktøy

| Verktøy                   | Type                | Sikkerhet | Beskrivelse                             |
| ------------------------- | ------------------- | --------- | --------------------------------------- |
| **Vitest**                | Unit Testing        | ✅ Native | Rask unit testing for React komponenter |
| **Playwright**            | E2E Testing         | ✅ Native | Cross-browser end-to-end testing        |
| **React Testing Library** | Component Testing   | ✅ Native | Komponent testing for React             |
| **Cypress**               | Integration Testing | ✅ Native | Visuell integration testing             |
| **Jest DOM**              | DOM Testing         | ✅ Native | DOM assertions og utilities             |

### ❌ Fjernet (Usikre)

- **TestSprite MCP** - Fjernet pga. security vulnerabilities og BUSL-1.1 lisens
- Eksterne testing APIer
- Third-party testing services

## 🚀 Hvordan Kjøre Tester

### Unit Tests (Vitest)

```bash
# Kjør alle unit tests
npm run test

# Kjør tests med UI
npm run test:ui

# Kjør tests med coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### E2E Tests (Playwright)

```bash
# Kjør E2E tests
npm run test:e2e

# Kjør med UI
npm run test:e2e:ui

# Kjør kun Chrome
npm run test:e2e:run

# Debug mode
npm run test:e2e:debug
```

### Integration Tests (Cypress)

```bash
# Kjør Cypress tests
npm run test:cypress

# Åpne Cypress UI
npm run test:cypress:open
```

### All Tests (Complete Suite)

```bash
# Kjør alle native tests
npm run test:native

# Kjør kun security tests
npm run test:security
```

## 🔒 Security Audit

Kjør security audit for å verifisere at TestSprite MCP er fullstendig fjernet:

```bash
./security-audit.sh
```

### Hva Security Audit Sjekker

1. ✅ Ingen TestSprite MCP referanser i kode
2. ✅ Ingen TestSprite dependencies i package.json
3. ✅ Native testing tools er installert
4. ✅ Ingen eksterne API kall i tests
5. ✅ Security konfigurasjoner

## 📁 Test Fil Struktur

```
src/
├── test/
│   └── setup.ts                 # Vitest setup
├── **/*.test.tsx               # Unit tests
└── **/*.spec.tsx               # Component tests

e2e/
└── *.spec.ts                   # Playwright E2E tests

cypress/
└── e2e/
    └── *.cy.ts                 # Cypress tests

tests/
└── e2e/                        # Legacy Playwright tests
```

## 🎯 Test Eksempler

### Unit Test (Vitest)

```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("App Component", () => {
  it("renders Norwegian Aurora System", () => {
    render(<App />);
    expect(screen.getByText(/Aurora System/i)).toBeInTheDocument();
  });
});
```

### E2E Test (Playwright)

```typescript
import { test, expect } from "@playwright/test";

test("Norwegian Aurora login flow", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator(".aurora-container")).toBeVisible();
});
```

### Integration Test (Cypress)

```typescript
describe("Aurora System", () => {
  it("should load securely", () => {
    cy.visit("/");
    cy.contains("🌊 Aurora System").should("be.visible");
  });
});
```

## 🔐 Sikkerhetsprinsipper

### ✅ Følger Disse Prinsippene

1. **No External APIs** - Alle tests kjører lokalt
2. **Open Source Tools** - Kun åpen kildekode verktøy
3. **Native Browser APIs** - Bruker kun standard web APIer
4. **No Data Leakage** - Ingen data sendes til eksterne tjenester
5. **Transparent Testing** - All test kode er synlig og reviderbar

### ❌ Unngår Disse

1. Externe testing APIer
2. Proprietary testing tools
3. Cloud-baserte testing services
4. Tools med BUSL eller restrictive lisenser
5. Tools med kjente security vulnerabilities

## 🚨 Debugging

### Vanlige Problemer

**Test fails på CI/CD:**

```bash
# Kjør i headless mode
npm run test:e2e:run
```

**Vitest setup issues:**

```bash
# Sjekk setup fil
cat src/test/setup.ts
```

**Playwright browser issues:**

```bash
# Installer browsers
npx playwright install
```

## 📊 Test Rapporter

### Coverage Rapport

```bash
npm run test:coverage
# Rapport: coverage/index.html
```

### Playwright Rapport

```bash
npm run test:e2e
# Rapport: playwright-report/index.html
```

### Cypress Rapport

Cypress genererer automatisk screenshots og videos ved feil.

## 🔄 Migrering fra TestSprite MCP

### Hva som Ble Fjernet

1. `@testsprite/testsprite-mcp` dependency
2. TestSprite API integrasjoner
3. Eksterne test API kall
4. TestSprite type definitions
5. MCP server TestSprite referanser

### Hva som Ble Lagt Til

1. Native Vitest setup
2. Playwright konfiguration
3. Cypress konfiguration
4. React Testing Library setup
5. Security audit script

## 🎉 Fordeler med Native Testing

### ✅ Security Benefits

- **No External Dependencies** - Ingen tredjeparter
- **Full Control** - Komplett kontroll over test miljø
- **Privacy** - Ingen data deling
- **Transparency** - Alt er åpen kildekode

### ✅ Performance Benefits

- **Faster Tests** - Ingen nettverksanrop til eksterne APIer
- **Offline Testing** - Fungerer uten internett
- **Predictable** - Ingen eksterne avhengigheter som kan feile

### ✅ Maintenance Benefits

- **No License Issues** - Kun MIT/Apache2 lisenser
- **Long-term Stability** - Ikke avhengig av eksterne tjenester
- **Community Support** - Store open source communities

## 📞 Support

Ved problemer med testing:

1. Kjør først `./security-audit.sh`
2. Sjekk test logs: `npm run test:coverage`
3. Verifiser browser setup: `npx playwright install`
4. Test Cypress: `npm run test:cypress:open`

**Viktig:** Bruk aldri TestSprite MCP eller andre eksterne testing APIer uten grundig security review.
