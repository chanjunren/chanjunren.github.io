---
sidebar_position: 6
sidebar_label: RDS
---

# RDS

## Use Cases

- **General OLTP**
  - MySQL is suitable for any application scenario that requires a transactional SQL engine, including mission-critical applications and high-traffic websites. MySQL adheres to the ACID principles, comes with extensions to the ANSI/ISO standard SQL, and supports XML and JSON. MySQL also supports high-availability database clusters and can handle TB-level databases.
  - Specifically, in our company, almost all business units use RDS. The content stored can generally be inferred from the business name, for example:
    - **Trading Counter**: Mainly stores orders, bills, holdings, accounts, trading assets, etc.
    - **Funds**: Mainly stores assets, asset analysis data, currency information, QP currency pair information, etc.
    - **Oklink**: Mainly stores state data, such as balances.
    - **Support**: Mainly stores reconciliation data, logs, community CRM, vulnerability feedback, scoring records, currency lists, and some data related to earning currency.
    - **C2C**: Mainly stores orders, commission orders, user, and merchant-related data.
    - **Auth**: Mainly stores authentication-related data.

## Advantages

- Lightweight, fast, low overall ownership cost, open-source, supports interfaces for multiple language connections and operations.
- Supports multiple operating systems.
- MySQL has a very flexible and secure permission and password system. When clients connect to the MySQL server, all password transmissions between them are encrypted, and MySQL supports host authentication.

## Disadvantages

- MySQL does not support custom data types.
- MySQL's support for stored procedures and triggers is not robust.
- Although MySQL is theoretically still an open-source product, there have been complaints about slow updates, especially after being acquired by Oracle.
- MySQL's support for XML is not adequate.
- Does not support complex queries: MySQL database does not support complex queries and cannot effectively handle complex data queries.
- Limited data storage capacity.
