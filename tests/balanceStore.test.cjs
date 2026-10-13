const {test} = require('node:test')
const assert = require('node:assert/strict')
const {readFileSync} = require('node:fs')
const {join} = require('node:path')
const {runInNewContext} = require('node:vm')
const {transpileModule, ModuleKind} = require('typescript')

function createStore(getBalance, getMonthlyState = async () => 0) {
  const source = readFileSync(join(__dirname, '../src/stores/balanceStore.ts'), 'utf8')
  const {outputText} = transpileModule(source, {compilerOptions: {module: ModuleKind.CommonJS}})
  const exports = {}
  runInNewContext(outputText, {
    exports, AbortController, Error,
    require: name => name === '../api/transactions.ts' ? {getBalance, getMonthlyState} : require(name),
  })
  return exports.useBalanceStore
}

function deferred() {
  let resolve
  let reject
  const promise = new Promise((done, fail) => {resolve = done; reject = fail})
  return {promise, resolve, reject}
}

test('zero and negative balances are successful data', async () => {
  for (const balance of [0, -250.75]) {
    const store = createStore(async () => balance)
    await store.getState().loadBalance()
    assert.equal(store.getState().balance, balance)
    assert.equal(store.getState().isBalanceLoading, false)
    assert.equal(store.getState().balanceError, null)
  }
})

test('failed requests clear previous balance and retain the HTTP error', async () => {
  const failure = Object.assign(new Error('Unauthorized'), {status: 401})
  let unauthorized = false
  const store = createStore(async () => {if (unauthorized) throw failure; return 100})
  await store.getState().loadBalance()
  unauthorized = true
  await store.getState().loadBalance()
  assert.equal(store.getState().balance, null)
  assert.equal(store.getState().balanceError, failure)
  assert.equal(store.getState().isBalanceLoading, false)
})

test('late responses cannot overwrite a more recent period', async () => {
  const oldRequest = deferred()
  const newRequest = deferred()
  const signals = []
  const store = createStore(async () => 1000, (type, month, year, signal) => {
    signals.push(signal)
    return month === 1 ? oldRequest.promise : newRequest.promise
  })
  const oldLoad = store.getState().loadMonthlyStats(1, 2026)
  const newLoad = store.getState().loadMonthlyStats(2, 2026)
  assert.equal(signals[0].aborted, true)
  newRequest.resolve(200)
  await newLoad
  oldRequest.resolve(100)
  await oldLoad
  assert.equal(store.getState().income, 200)
  assert.equal(store.getState().expenses, 200)
  assert.equal(store.getState().month, 2)
})

test('reset aborts loading and ignores a late response from the old session', async () => {
  const request = deferred()
  let signal
  const store = createStore((month, year, requestSignal) => {signal = requestSignal; return request.promise})
  const load = store.getState().loadBalance()
  store.getState().reset()
  assert.equal(signal.aborted, true)
  request.resolve(1000)
  await load
  assert.equal(store.getState().balance, null)
  assert.equal(store.getState().isBalanceLoading, false)
  assert.equal(store.getState().month, new Date().getMonth() + 1)
})

test('refresh retains the selected month and year', async () => {
  const calls = []
  const store = createStore(async () => 1000, async (type, month, year) => {calls.push([type, month, year]); return 50})
  await store.getState().loadMonthlyStats(10, 2026)
  await store.getState().refreshAll()
  assert.deepEqual(calls, [
    ['income', 10, 2026], ['expenses', 10, 2026],
    ['income', 10, 2026], ['expenses', 10, 2026],
  ])
})

test('malformed backend data never appears as a valid balance', async () => {
  for (const value of ['100', null, NaN, Infinity]) {
    const store = createStore(async () => value)
    await store.getState().loadBalance()
    assert.equal(store.getState().balance, null)
    assert.equal(store.getState().isBalanceLoading, false)
    assert.equal(store.getState().balanceError.message, 'Сервер вернул некорректный баланс')
  }
})

test('balance and monthly statistics load independently and preserve zero amounts', async () => {
  const balanceRequest = deferred()
  const monthlyRequest = deferred()
  const signals = []
  const store = createStore((month, year, signal) => {
    signals.push(signal)
    return balanceRequest.promise
  }, (type, month, year, signal) => {
    signals.push(signal)
    return monthlyRequest.promise
  })
  const refresh = store.getState().refreshAll()
  assert.equal(signals.length, 3)
  assert.ok(signals.every(signal => !signal.aborted))
  const monthlyLoaded = new Promise(resolve => {
    const unsubscribe = store.subscribe(state => {
      if (!state.isMonthlyStatsLoading) {
        unsubscribe()
        resolve()
      }
    })
  })
  monthlyRequest.resolve(0)
  await monthlyLoaded
  assert.equal(store.getState().income, 0)
  assert.equal(store.getState().expenses, 0)
  assert.equal(store.getState().isMonthlyStatsLoading, false)
  assert.equal(store.getState().isBalanceLoading, true)
  balanceRequest.resolve(-250)
  await refresh
  assert.equal(store.getState().balance, -250)
})

test('monthly failure aborts its companion request without losing the balance', async () => {
  const failure = Object.assign(new Error('Unauthorized'), {status: 401})
  let signal
  const store = createStore(async () => 1000, async (type, month, year, requestSignal) => {
    signal = requestSignal
    if (type === 'income') throw failure
    return 50
  })
  await store.getState().refreshAll()
  assert.equal(signal.aborted, true)
  assert.equal(store.getState().balance, 1000)
  assert.equal(store.getState().income, null)
  assert.equal(store.getState().expenses, null)
  assert.equal(store.getState().monthlyStatsError, failure)
  assert.equal(store.getState().balanceError, null)
  assert.equal(store.getState().isMonthlyStatsLoading, false)
})

test('reset ignores late monthly responses from a previous session', async () => {
  const request = deferred()
  let signal
  const store = createStore(async () => 1000, (type, month, year, requestSignal) => {
    signal = requestSignal
    return request.promise
  })
  const load = store.getState().loadMonthlyStats(9, 2026)
  store.getState().reset()
  assert.equal(signal.aborted, true)
  request.resolve(100)
  await load
  assert.equal(store.getState().income, null)
  assert.equal(store.getState().expenses, null)
  assert.equal(store.getState().isMonthlyStatsLoading, false)
})
