# Remix Assert Library

- [Remix Assert Library](#remix-assert-library)
  - [Assert](#assert)
    - [Assert.ok(value\[, message\])](#assertokvalue-message)
    - [Assert.equal(actual, expected\[, message\])](#assertequalactual-expected-message)
    - [Assert.notEqual(actual, expected\[, message\])](#assertnotequalactual-expected-message)
    - [Assert.greaterThan(value1, value2\[, message\])](#assertgreaterthanvalue1-value2-message)
    - [Assert.lesserThan(value1, value2\[, message\])](#assertlesserthanvalue1-value2-message)

## Assert

### Assert.ok(value[, message])

- `value`: \<bool\>
- `message`: \<string\>

Tests if value is truthy. `message` is returned in case of failure.

Examples:

```JavaScript
Assert.ok(true);
// OK
Assert.ok(false, "it\'s false");
// error: it's false
```

### Assert.equal(actual, expected[, message])

- `actual`: \<uint | int | bool | address | bytes32 | string\>
- `expected`: \<uint | int | bool | address | bytes32 | string\>
- `message`: \<string\>

Tests if `actual` & `expected` values are same. `message` is returned in case of failure.

Examples:

```JavaScript
Assert.equal(string("a"), "a");
// OK
Assert.equal(uint(100), 100);
// OK
foo.set(200)
Assert.equal(foo.get(), 200);
// OK
Assert.equal(foo.get(), 100, "value should be 100");
// error: value should be 100
```

### Assert.notEqual(actual, expected[, message])

- `actual`: \<uint | int | bool | address | bytes32 | string\>
- `expected`: \<uint | int | bool | address | bytes32 | string\>
- `message`: \<string\>

Tests if `actual` & `expected` values are not same. `message` is returned in case of failure.

Examples:

```Javascript
Assert.notEqual(string("a"), "b");
// OK
foo.set(200)
Assert.notEqual(foo.get(), 200, "value should not be 200");
// error: value should not be 200
```

### Assert.greaterThan(value1, value2[, message])

- `value1`: \<uint | int\>
- `value2`: \<uint | int\>
- `message`: \<string\>

Tests if `value1` is greater than `value2`. `message` is returned in case of failure.

Examples:

```Javascript
Assert.greaterThan(uint(2), uint(1));
// OK
Assert.greaterThan(uint(-2), uint(1));
// OK
Assert.greaterThan(int(2), int(1));
// OK
Assert.greaterThan(int(-2), int(-1), "-2 is not greater than -1");
// error: -2 is not greater than -1
```

### Assert.lesserThan(value1, value2[, message])

- `value1`: \<uint | int\>
- `value2`: \<uint | int\>
- `message`: \<string\>

Tests if `value1` is lesser than `value2`. `message` is returned in case of failure.

Examples:

```Javascript
Assert.lesserThan(int(-2), int(-1));
// OK
Assert.lesserThan(int(2), int(1), "2 is not lesser than 1");
// error: 2 is not lesser than 1
```
