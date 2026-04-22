import test from 'node:test';
import assert from 'node:assert';
import { resolveStockSymbol } from '../src/utils/stockUtils.js';

test('resolveStockSymbol - Indian Stocks', (t) => {
  assert.strictEqual(resolveStockSymbol('TCS'), 'TCS.NS');
  assert.strictEqual(resolveStockSymbol('reliance'), 'RELIANCE.NS');
  assert.strictEqual(resolveStockSymbol('  sbIn  '), 'SBIN.NS');
});

test('resolveStockSymbol - Global Stocks (with suffix)', (t) => {
  assert.strictEqual(resolveStockSymbol('AAPL.US'), 'AAPL.US');
  assert.strictEqual(resolveStockSymbol('TSLA.'), 'TSLA.');
});

test('resolveStockSymbol - Crypto / Pairs', (t) => {
  assert.strictEqual(resolveStockSymbol('BTC-USD'), 'BTC-USD');
  assert.strictEqual(resolveStockSymbol('ETH-BTC'), 'ETH-BTC');
});

test('resolveStockSymbol - Edge Cases', (t) => {
  assert.strictEqual(resolveStockSymbol(''), '');
  assert.strictEqual(resolveStockSymbol(null), '');
});
