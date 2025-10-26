🗓️ 08102025 1037

# junction_table_design

# Junction Table Design Cheatsheet

## Core Principle
**A junction table should represent ONE type of relationship between two entities.**

```ad-important
**The Fundamental Question: "Are the relationships independent or bound together?"**

This single question drives your entire junction table design.
```

## Design Patterns

### Pattern 1: Independent Relationships

### When to Use
Two entities (B and C) relate to entity A **separately**.

**Characteristics:**
- Adding B doesn't require specifying C
- Adding C doesn't require specifying B
- All B's work with all C's (cross product)

### Design
```sql
-- Two separate tables
table_a_b (a_id, b_id)
table_a_c (a_id, c_id)
```

### Example
```
Order has:
- Products: {P1, P2, P3}
- Shipping methods: {Standard, Express}

All products can use all shipping methods
```

---

## Pattern 2: Bound Relationship

### When to Use
The **combination** of B and C relating to A is meaningful.

**Characteristics:**
- "Which B for which C?" is a meaningful question
- B and C cannot vary independently
- Specific pairings matter

### Design
```sql
-- One combined table
table_a_b_c (a_id, b_id, c_id)
```

### Example
```
Employee assignment:
- Employee X works on Project Y in Role Z

The triple (employee, project, role) is inseparable
```

---

## The Decision Test

| Question | Independent → Separate | Bound → Combined |
|----------|----------------------|------------------|
| Can I add B without specifying C? | YES ✅ | NO ❌ |
| Can I add C without specifying B? | YES ✅ | NO ❌ |
| Does the B+C combination have unique meaning? | NO ❌ | YES ✅ |
| Are they filters/attributes that work together? | NO ❌ | YES ✅ |

---

## Anti-Pattern: The Sparse Table

```ad-danger
**❌ The Sparse Table Anti-Pattern**

Creating a single table where most columns are NULL is a major design smell that indicates you're mixing different relationship types.
```

### Problem Example
```sql
CREATE TABLE relation (
    a_id,
    b_id,  -- sometimes NULL
    c_id,  -- sometimes NULL
    d_id   -- sometimes NULL
)

-- Rows look like:
(1, 10, NULL, NULL)  -- a relates to b
(1, NULL, 20, NULL)  -- a relates to c
(1, NULL, NULL, 30)  -- a relates to d
```

### Problems
1. **Semantic confusion** - each row represents a different type of relationship
2. **Data waste** - most columns are NULL
3. **Broken constraints** - can't enforce uniqueness properly (NULL ≠ NULL in SQL)
4. **Query complexity** - need `isNotNull()` checks everywhere
5. **Maintenance nightmare** - hard to understand and modify

### ✅ DO THIS INSTEAD
```sql
-- Separate tables, each with clear purpose
table_a_b (a_id, b_id)
table_a_c (a_id, c_id)
table_a_d (a_id, d_id)
```

---

## Naming Conventions

### Standard Pattern
```
{entity1}_{entity2}           ✅ BEST
{entity1}_{entity2}s          ✅ GOOD (plural)
{entity1}_{entity2}_relation  ❌ REDUNDANT
{entity1}_{entity2}_mapping   ❌ REDUNDANT
{entity1}_{entity2}_link      ❌ REDUNDANT
```

The table name itself implies it's a relationship - no need to say it twice.

### When to Add Suffix
Only when the relationship has **significant domain meaning** beyond just linking:

```
employee_project_assignments  ✅ (implies work assignments)
book_author_contributions     ✅ (implies authorship roles)
user_course_enrollments       ✅ (implies enrollment process)
```

---

## Key Database Concepts

### 1. **Junction/Join Table**
A table that implements a many-to-many relationship by storing foreign keys to both entities.

### 2. **Ternary Relationship**
A relationship involving three entities where all three must be considered together as a unit.

### 3. **Normalization**
Don't mix unrelated data. Each table should have **one clear purpose**.

### 4. **NULL Handling**
- NULL ≠ NULL in SQL uniqueness checks
- Sparse tables with many NULLs indicate design problems
- If you need NULLs in junction tables, you're probably mixing relationships

---

## Decision Tree

```
Do B and C both relate to A?
│
├─ Can they vary independently?
│  │
│  ├─ YES → Use separate tables
│  │         table_a_b + table_a_c
│  │
│  └─ NO → Does the B+C combination matter?
│           │
│           ├─ YES → Use combined table
│           │         table_a_b_c
│           │
│           └─ NO → Re-examine requirements
│
└─ Are they different types of relationships?
   │
   └─ YES → ALWAYS use separate tables
```

---

## Mental Model

### Think of it like tagging

**Independent (Separate Tables):**
```
Article has:
- Tags: {tech, tutorial, beginner}
- Authors: {Alice, Bob}

All authors contributed to all tags
→ article_tags + article_authors
```

**Bound (Combined Table):**
```
Article has:
- Alice wrote the "tech" section
- Bob wrote the "tutorial" section

Author-section pairs are specific
→ article_author_sections (article_id, author_id, section_id)
```

---

## The Golden Rule

```ad-warning
**The Golden Rule:** If you find yourself creating rows with mostly NULL values, you're mixing different relationship types. Split them into separate tables.
```

---

## Quick Reference Examples

### ✅ Independent Relationships (Separate Tables)

```sql
-- User can have multiple roles AND multiple departments independently
user_roles (user_id, role_id)
user_departments (user_id, department_id)
```

```sql
-- Product can have multiple categories AND multiple tags independently
product_categories (product_id, category_id)
product_tags (product_id, tag_id)
```

```sql
-- Course can have multiple instructors AND multiple prerequisites independently
course_instructors (course_id, instructor_id)
course_prerequisites (course_id, prerequisite_course_id)
```

### ✅ Bound Relationships (Combined Table)

```sql
-- Student enrolled in course with specific grade
student_course_enrollments (student_id, course_id, grade, enrollment_date)
```

```sql
-- Doctor works at hospital in specific department
doctor_hospital_departments (doctor_id, hospital_id, department_id)
```

```sql
-- Product sold in region at specific price
product_region_pricing (product_id, region_id, price, currency)
```

### ❌ Anti-Pattern (Sparse Table)

```sql
-- DON'T: Mixing different relationship types
user_relations (
    user_id,
    role_id,       -- sometimes NULL
    department_id, -- sometimes NULL
    team_id,       -- sometimes NULL
    project_id     -- sometimes NULL
)
```

---

## Summary

| Scenario | Solution | Key Indicator |
|----------|----------|---------------|
| Independent relationships | Separate tables | Can add/remove each independently |
| Bound relationship | Combined table | The combination has unique meaning |
| Multiple relationship types | ALWAYS separate | Different semantic meanings |
| Mostly NULL columns | Split into separate tables | Design smell - fix immediately |


---
## References
