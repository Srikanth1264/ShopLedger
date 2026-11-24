# Repository Guidelines

## Project Structure

ShopLedger is a Node.js and Express point-of-sale app for retail and wholesale billing, inventory, khata credit, and GST invoices.

- `server.js` starts the server, serves the browser UI, mounts the API, and exposes the printable invoice route.
- `config.js` holds shop details, GST slabs, inventory defaults, and coupon settings.
- `routes/` handles HTTP requests. `lib/` contains business logic for pricing, tax, inventory, orders, khata, invoices, reporting, and storage.
- `public/` contains `index.html`, `css/style.css`, and `js/app.js`. `data/db.json` is the file-backed store for products, orders, customers, settlements, and audit entries.

## Local Development

- `npm install` installs the dependencies declared in `package.json`.
- `npm start` runs `node server.js`. Open `http://localhost:3000` unless you set `PORT`.
- `npm test` is a placeholder that exits with an error. The app serves its frontend files directly and has no build step.

## Coding Style

Match the surrounding JavaScript. Use two-space indentation, single quotes, semicolons, and camelCase names such as `computeTotals`. Follow the existing CommonJS conventions with `require`, `exports`, and `module.exports`. Keep HTTP handling in `routes/` and business rules in `lib/`. The repository configures no linter or formatter.

## Testing Changes

The repository has no automated test suite, test naming convention, or coverage threshold. Record manual checks in the pull request. For billing changes, compare the cart preview, saved order, and printable invoice using mixed GST slabs and a capped coupon. For inventory or khata changes, check placement, cancellation, and the resulting stock and balances. Use disposable data because these actions rewrite `data/db.json`. Keep real customer records and credentials out of commits.

## Commits and Pull Requests

Recent commits use short, lowercase descriptions without a required prefix, for example `invoice page for accountant`. Keep each commit focused. In the pull request, describe the behavior change and verification steps, link the relevant issue if one exists, and include screenshots for visible changes. Flag any effect on existing orders, invoice totals, or stored data.
