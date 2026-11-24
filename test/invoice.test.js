var test = require('node:test');
var assert = require('node:assert/strict');
var invoice = require('../lib/invoice');
var pricing = require('../lib/pricing');

function assertFigures(order, expectedInvoice, expectedCheckout) {
  var { rows, ...invoiceTotals } = invoice.computeInvoiceFigures(order);
  var { lines, taxable, ...checkoutTotals } = pricing.computeTotals(order.items, order.coupon);

  assert.deepStrictEqual({
    ...invoiceTotals,
    lines: rows.map(function (row) {
      return [row.gstPercent, row.lineTax];
    })
  }, expectedInvoice, 'printable invoice figures');

  assert.deepStrictEqual({
    ...checkoutTotals,
    lines: lines.map(function (line) {
      return [line.gstPercent, line.tax];
    })
  }, expectedCheckout, 'checkout figures');
}

test('#1001 invoice uses the checkout 5% and 12% HSN slabs', function () {
  // Saved lines can carry an HSN without an explicit gstRate.
  var order = {
    id: 1001,
    coupon: '',
    items: [
      { name: 'Rice', price: 100, qty: 2, hsn: '1006' },
      { name: 'Ghee', price: 300, qty: 1, hsn: '0405' }
    ]
  };

  var expected = {
    subtotal: 500, discount: 0, tax: 46, cgst: 23, sgst: 23, total: 546,
    lines: [[5, 10], [12, 36]]
  };

  assertFigures(order, expected, expected);
});

test('#1002 invoice applies SAVE10 before GST', function () {
  var order = {
    id: 1002,
    coupon: 'SAVE10',
    items: [{ name: 'Tea', price: 500, qty: 2, hsn: '0902', gstRate: 18 }]
  };

  var expected = {
    subtotal: 1000, discount: 100, tax: 162, cgst: 81, sgst: 81, total: 1062,
    lines: [[18, 162]]
  };

  assertFigures(order, expected, expected);
});

test('#1004 invoice applies the SAVE10 cap', function () {
  var order = {
    id: 1004,
    coupon: 'SAVE10',
    items: [{ name: 'Coffee', price: 560, qty: 4, hsn: '0901' }]
  };

  var expected = {
    subtotal: 2240, discount: 150, tax: 376.2, cgst: 188.1, sgst: 188.1, total: 2466.2,
    lines: [[18, 376.2]]
  };

  assertFigures(order, expected, expected);
});

test('CURRENT BEHAVIOUR: #1008 invoice matches checkout at 18% without a coupon', function () {
  var order = {
    id: 1008,
    coupon: '',
    items: [
      { name: 'Tea', price: 100, qty: 1, hsn: '0902' },
      { name: 'Coffee', price: 100, qty: 2, hsn: '0901', gstRate: 18 }
    ]
  };
  var expected = {
    subtotal: 300, discount: 0, tax: 54, cgst: 27, sgst: 27, total: 354,
    lines: [[18, 18], [18, 36]]
  };

  assertFigures(order, expected, expected);
});

test('invoice matches checkout for mixed HSN slabs with capped SAVE10', function () {
  var order = {
    coupon: 'SAVE10',
    items: [
      { name: 'Rice', price: 560, qty: 2, hsn: '1006' },
      { name: 'Ghee', price: 1120, qty: 1, hsn: '0405' }
    ]
  };
  var expected = {
    subtotal: 2240, discount: 150, tax: 177.65, cgst: 88.83, sgst: 88.82, total: 2267.65,
    lines: [[5, 52.25], [12, 125.4]]
  };

  assertFigures(order, expected, expected);
});
