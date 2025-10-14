# Type and Data Inconsistencies

- **WalletBalance** interface has no **blockchain** field
- **FormattedWalletBalance** is declared but not used properly
- **getPriority(blockchain: any)** is using _any_ defeats TypeScript’s purpose.

# Logical / Computational Errors

- Inside **filter**, variable **lhsPriority** is used but never defined
- Filter condition reversed, The filter keeps balances with _amount <= 0_ instead of _> 0_. Probably incorrect logic.
- Comparator sometimes returns nothing, Missing _return 0_ for equal priorities → unstable sort.
- Using both _balances_ and _prices_ as **useMemo** dependencies

# Performance & React Anti-Patterns

- **getPriority** defined inside component, recreated every render, wasting memory, use **useCallback**
- _formattedBalances_ and _sortedBalances_ both map/filter the same array, should combine formatting and sorting in one **useMemo**
- Using array index as _key_. Leads to unnecessary re-renders if order changes. Use unique key like **currency** or **blockchain**.
- Not memoizing derived rows, use **useMemo** for rows or memoized <WalletRow />.
- _prices[balance.currency]_ may be undefined, should fallback to 0 with _(prices[balance.currency] ?? 0) _ balance.amount\*.
- **toFixed()** used with no argument

# Maintainability Issues

- Large monolithic function, should split into small helpers.
