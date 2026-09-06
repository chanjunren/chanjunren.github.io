🗓️ 30082026 0025

# authentication_flows

**Authentication** answers “Who is this?” **Authorization** answers “What may this identity do?” An identity provider (IdP) usually authenticates the person and issues signed protocol messages; the application maps that identity to its own user, organization, and permissions.

The two common flows below use a browser redirect and an authorization-code exchange. OAuth/OIDC details vary by provider, but the ownership boundary stays useful.

## Existing-user login

An existing user already has an IdP account and an application record.

1. The user selects **Sign in**.
2. The application creates a short-lived `state` value and, for a public client, a PKCE verifier/challenge. It redirects the browser to the IdP.
3. The IdP authenticates the user. This may involve a password, passkey, social login, or MFA. The password stays at the IdP.
4. The IdP redirects the browser back with a short-lived authorization code.
5. The application backend sends the code and PKCE verifier to the IdP over HTTPS. The IdP returns tokens, commonly an ID token and an access token.
6. The backend validates the response: signature, issuer, audience, expiry, nonce/state, and the expected redirect flow.
7. The backend finds the application user by the stable IdP subject identifier (`sub`), checks application status and membership, then creates an application session.
8. The browser sends the session cookie on later requests. The application re-checks authorization for each protected operation.

The authorization code proves that the browser completed the IdP flow. It is not a long-term application credential.

## New-user invitation and signup

An invitation is an application workflow that gives a person permission to join a particular application context. It is not, by itself, proof of identity.

1. An administrator asks the application to invite an email address to an organization, project, or role.
2. The application creates a pending invitation with a random, single-use token, an expiry, the intended scope, and the inviter. It sends a link to the recipient.
3. The recipient opens the link. The application records the pending invitation in a server-side flow or binds it to a short-lived signed state value.
4. The recipient is sent to the IdP to sign in or create an account. The IdP collects the password or passkey, verifies the email if required, and applies MFA or other policies.
5. The IdP returns an authorization code. The application exchanges and validates it as in existing-user login.
6. The application links the IdP subject to its pending invitation. It creates or completes the local user record, grants only the invited membership and role, and marks the invitation consumed.
7. The application creates a session and redirects the user to the invited area.

If the recipient already has an IdP account, the “signup” part becomes a normal login. The application must still require a valid invitation and must not grant access merely because the email looks similar.

## Authentication versus authorization

| Question | Usually answered by | Example |
|---|---|---|
| Who controls this account? | IdP | The IdP subject `sub=abc123` authenticated with MFA |
| Is this person allowed into this app? | Application | The subject has an active membership in Acme |
| What can they do here? | Application | `project_editor` may edit project documents |
| How do they prove control of a credential? | IdP | Password, passkey, recovery method, or MFA |

An authenticated identity is not automatically an authorized application user. A valid token can still be rejected because the account is disabled, the invitation expired, or the user lacks the required role.

## Ownership boundary

| Identity provider owns | Application owns |
|---|---|
| Account identifier and login methods | Local user/profile record and IdP-subject mapping |
| Password/passkey storage and credential recovery | Invitations, memberships, organizations, and roles |
| MFA, suspicious-login detection, and account lockout | Business data, billing state, feature access, and audit decisions |
| IdP session and token issuance | Application session, logout behavior, and authorization checks |
| Claims it publishes, within its contract | Which claims it trusts and how it maps them |

## Passwords, sessions, and tokens

Passwords belong at the IdP because it can specialize in password hashing, breach detection, recovery, MFA, rate limiting, and credential lifecycle. The application avoids storing a high-value credential database and can support several login methods through one integration. Using an IdP does not remove responsibility: the application must still protect sessions, validate tokens, and handle account-linking safely.

Keep these credentials conceptually separate:

- **IdP session**: a browser session at the IdP. It may let the user sign in to several applications without re-entering credentials.
- **Authorization code**: a short-lived, one-time value returned through the redirect. The backend exchanges it for tokens.
- **ID token**: an OIDC assertion about authentication and the user. The client uses it for identity claims; it is not an API permission slip.
- **Access token**: a credential for a specific resource server and scopes. Send it only to its intended API.
- **Application session**: often a short opaque cookie whose server-side record points to the local user. A stateless signed cookie or JWT is another option, with different revocation and storage tradeoffs.
- **Refresh token**: a longer-lived credential used to obtain new access tokens. Keep it out of browser JavaScript where possible and rotate it when the provider supports rotation.

For a browser application with a backend, a secure, `HttpOnly`, `Secure`, appropriately `SameSite` session cookie is often simpler than exposing long-lived tokens to JavaScript. The exact choice depends on the client architecture and threat model.

## Security considerations

```ad-warning
Never treat an email address, invitation URL, or decoded token payload as sufficient proof. Validate the cryptographic response and bind the resulting IdP subject to the intended application record.
```

- Use HTTPS and the authorization-code flow with PKCE. Validate exact redirect URIs.
- Generate and verify `state` to prevent login CSRF; use a nonce for OIDC replay protection.
- Validate token signature, issuer, audience, expiry, not-before time, and required scopes/claims. Do not accept a token merely because it decodes as JSON.
- Use stable provider subject identifiers for linking. Do not silently link accounts by an unverified or mutable email claim.
- Make invitation tokens random, single-use, narrowly scoped, and short-lived. Hash stored tokens where practical, avoid logging them, and do not leak them through analytics or referrer headers.
- Prevent open redirects and session fixation. Rotate the application session after login and invitation acceptance.
- Apply CSRF protection to cookie-authenticated state-changing requests, and rate-limit login, signup, invitation, and recovery endpoints.
- Keep access tokens out of URLs and minimize their scopes and lifetime. Revoke sessions on logout, account disablement, and security events.
- Decide deliberately whether an IdP logout also logs the user out of the application; these are separate sessions.

## Tradeoffs and limitations

| Choice | Benefits | Costs or limits |
|---|---|---|
| Use an external IdP | Mature credential security, MFA, recovery, and social login | Provider outage, fees, vendor lock-in, and integration complexity |
| Application session after callback | Simple browser requests and easy local authorization | Session storage, expiry, revocation, and multi-instance consistency must be designed |
| Stateless JWT application session | Easy horizontal scaling and fewer session lookups | Revocation is harder; claims can become stale; leakage has a wider lifetime |
| Invitation before signup | Admin controls who may join and with which scope | Expiry, resend, wrong-account, forwarding, and email-delivery edge cases |
| Just-in-time signup without invitation | Low friction and broad self-service | The application needs separate abuse controls and onboarding authorization |

An invitation link should establish *eligibility to claim access*, not replace authentication. Forwarding an invitation may be acceptable only if the product intentionally treats possession of the email link as part of its trust model.

## Sequence diagrams

```mermaid
sequenceDiagram
    actor User
    participant App
    participant IdP as Identity provider

    User->>App: Sign in
    App-->>User: Redirect with state + PKCE challenge
    User->>IdP: Authenticate
    IdP-->>User: Redirect with authorization code
    User->>App: Callback(code, state)
    App->>IdP: Exchange code + PKCE verifier
    IdP-->>App: ID token + access token
    App->>App: Validate tokens; find local user; authorize
    App-->>User: Secure application session cookie
    User->>App: Request with session cookie
    App-->>User: Data or authorization failure
```

```mermaid
sequenceDiagram
    actor Invitee
    participant App
    participant IdP as Identity provider
    participant Admin

    Admin->>App: Invite email + role/scope
    App-->>Invitee: Single-use invitation link
    Invitee->>App: Open invitation
    App-->>Invitee: Redirect to signup/login
    Invitee->>IdP: Create account or authenticate
    IdP-->>Invitee: Redirect with authorization code
    Invitee->>App: Callback(code, state)
    App->>IdP: Exchange and validate code/tokens
    IdP-->>App: Authenticated IdP subject
    App->>App: Verify invitation; link subject; grant invited scope
    App-->>Invitee: Secure application session cookie
```

## References

- [[mcp_authorization]] — a concrete OAuth authorization-code and PKCE example
- [[tls]] — why HTTPS protects credentials and tokens in transit
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) — ID tokens and authentication claims
- [RFC 7636: Proof Key for Code Exchange by OAuth Public Clients](https://www.rfc-editor.org/rfc/rfc7636) — PKCE
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) — practical authentication controls
