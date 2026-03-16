🗓️ 16032026 2100

# postman_scripts_cheatsheet

**Postman scripts** run JavaScript in a sandboxed environment at two points: before a request (**pre-request**) and after a response (**tests/post-response**). They share data via variables and enable automated testing, auth flows, and request chaining.

## Pre-request Scripts

### Set variables

```js
pm.variables.set("key", "value");           // current request only
pm.environment.set("key", "value");         // environment scope
pm.collectionVariables.set("key", "value"); // collection scope
pm.globals.set("key", "value");             // global scope
```

### Generate dynamic data

```js
// UUID
pm.variables.set("requestId", pm.variables.replaceIn("{{$guid}}"));

// Timestamp
pm.variables.set("timestamp", Date.now());

// Random integer
pm.variables.set("randomNum", Math.floor(Math.random() * 1000));
```

### Compute auth headers

```js
const crypto = require("crypto-js");
const secret = pm.environment.get("apiSecret");
const body = pm.request.body.raw;
const signature = crypto.HmacSHA256(body, secret).toString();
pm.variables.set("signature", signature);
```

## Test Scripts (Post-response)

### Status code checks

```js
pm.test("Status 200", () => {
  pm.response.to.have.status(200);
});

pm.test("Status is 2xx", () => {
  pm.expect(pm.response.code).to.be.within(200, 299);
});
```

### Response body assertions

```js
const json = pm.response.json();

pm.test("Has expected field", () => {
  pm.expect(json).to.have.property("data");
  pm.expect(json.data).to.be.an("array").that.is.not.empty;
});

pm.test("Specific value check", () => {
  pm.expect(json.data[0].status).to.eql("active");
});
```

### Response time

```js
pm.test("Response under 500ms", () => {
  pm.expect(pm.response.responseTime).to.be.below(500);
});
```

### Header checks

```js
pm.test("Content-Type is JSON", () => {
  pm.response.to.have.header("Content-Type", "application/json; charset=utf-8");
});
```

### Schema validation

```js
const schema = {
  type: "object",
  required: ["id", "name"],
  properties: {
    id: { type: "number" },
    name: { type: "string" },
  },
};

pm.test("Schema is valid", () => {
  pm.expect(tv4.validate(json, schema)).to.be.true;
});
```

## Environment Variables

### Read

```js
pm.environment.get("key");
pm.collectionVariables.get("key");
pm.globals.get("key");

// In URL/body/headers, use template syntax:
// {{key}}
```

### Variable resolution order
1. Local (set by `pm.variables.set`)
2. Data (from CSV/JSON in collection runner)
3. Environment
4. Collection
5. Global

:::warning
`pm.variables.get` reads from the resolved chain above — use scope-specific getters when you need a specific level.
:::

## Request Chaining

### Pass data between requests

```js
// In Request A's test script — save token for Request B
const token = pm.response.json().access_token;
pm.environment.set("authToken", token);

// Request B uses {{authToken}} in Authorization header
```

### Conditional workflow (Collection Runner)

```js
// Skip to a specific request by name
if (json.status === "pending") {
  postman.setNextRequest("Poll Status");
} else {
  postman.setNextRequest("Final Step");
}

// Stop execution
postman.setNextRequest(null);
```

## Utility Snippets

### Log to console

```js
console.log("Response:", pm.response.json());
console.warn("Unexpected status:", pm.response.code);
```

### Send a request from script

```js
pm.sendRequest({
  url: pm.environment.get("baseUrl") + "/auth/token",
  method: "POST",
  header: { "Content-Type": "application/json" },
  body: {
    mode: "raw",
    raw: JSON.stringify({ client_id: pm.environment.get("clientId") }),
  },
}, (err, res) => {
  pm.environment.set("token", res.json().access_token);
});
```

### Retry logic

```js
const maxRetries = 3;
let retryCount = pm.environment.get("retryCount") || 0;

if (pm.response.code === 429 && retryCount < maxRetries) {
  pm.environment.set("retryCount", retryCount + 1);
  postman.setNextRequest(pm.info.requestName); // re-run current request
} else {
  pm.environment.set("retryCount", 0);
}
```

---

## References

- https://learning.postman.com/docs/tests-and-scripts/write-scripts/intro-to-scripts/
- https://learning.postman.com/docs/tests-and-scripts/write-scripts/test-scripts/
- https://learning.postman.com/docs/sending-requests/variables/variables/
