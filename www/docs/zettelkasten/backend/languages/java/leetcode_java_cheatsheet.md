🗓️ 06072026 1200

# leetcode_java_cheatsheet

**What it is:**
- Syntax reference for the data structures used most often in LeetCode-style problems, in Java
- Focused on the operations that come up under time pressure — construction, common methods, iteration, gotchas
- Not a DSA concepts primer — assumes you know what a heap/deque/trie *is*, just not the Java spelling of it

## Arrays

```java
int[] arr = new int[10];               // fixed size, zero-initialized
int[] arr = {1, 2, 3};                 // literal
int[][] grid = new int[rows][cols];    // 2D, zero-initialized
int[][] grid = {{1, 2}, {3, 4}};       // 2D literal

Arrays.fill(arr, -1);                  // fill all
Arrays.sort(arr);                      // ascending, in place
Arrays.sort(arr, from, to);            // sort sub-range [from, to)
int[] copy = Arrays.copyOf(arr, arr.length);
int[] slice = Arrays.copyOfRange(arr, from, to); // [from, to)
Arrays.equals(a, b);                   // element-wise equality
String s = Arrays.toString(arr);       // "[1, 2, 3]" for debugging

// Sort descending (Integer[] only — primitives have no Comparator overload)
Integer[] boxed = {3, 1, 2};
Arrays.sort(boxed, Collections.reverseOrder());

// Sort 2D array by a column
Arrays.sort(grid, (a, b) -> a[0] - b[0]);          // by col 0 ascending
Arrays.sort(grid, (a, b) -> b[0] - a[0]);          // by col 0 descending
```

```ad-warning
`Arrays.sort` on `int[]` uses dual-pivot quicksort (O(n log n) avg, O(n²) worst). On `Object[]` (including `Integer[]`) it uses TimSort — stable, guaranteed O(n log n). Prefer `Integer[]` when a stable sort or custom comparator matters.
```

## ArrayList

```java
List<Integer> list = new ArrayList<>();
list.add(5);                // append
list.add(0, 5);              // insert at index — O(n)
list.get(i);
list.set(i, val);            // overwrite
list.remove(i);              // remove by INDEX — O(n)
list.remove(Integer.valueOf(5)); // remove by VALUE (autobox to disambiguate)
list.contains(5);            // O(n)
list.indexOf(5);             // O(n), -1 if absent
list.size();
list.isEmpty();
Collections.sort(list);
Collections.reverse(list);
Collections.max(list);
Collections.min(list);

// int[] <-> List<Integer> conversions (no direct cast)
List<Integer> fromArr = Arrays.stream(arr).boxed().collect(Collectors.toList());
int[] toArr = list.stream().mapToInt(Integer::intValue).toArray();
```

```ad-warning
`list.remove(5)` removes the element **at index 5**. `list.remove(Integer.valueOf(5))` removes the value **5**. This is a classic LeetCode footgun with `int` lists.
```

## HashMap / HashSet

```java
Map<String, Integer> map = new HashMap<>();
map.put("a", 1);
map.get("a");                          // null if absent
map.getOrDefault("a", 0);
map.containsKey("a");
map.remove("a");
map.put("a", map.getOrDefault("a", 0) + 1);   // classic counting bump
map.merge("a", 1, Integer::sum);              // same, one line
map.computeIfAbsent(key, k -> new ArrayList<>()).add(val); // group-by / adjacency list build

for (Map.Entry<String, Integer> e : map.entrySet()) { e.getKey(); e.getValue(); }
for (String k : map.keySet()) { }
for (int v : map.values()) { }

Set<Integer> set = new HashSet<>();
set.add(1);
set.contains(1);
set.remove(1);

Set<Integer> set = new HashSet<>(list);        // dedupe a list in one line
```

```ad-info
`LinkedHashMap` / `LinkedHashSet` preserve insertion order — use when iteration order matters (e.g. building an LRU cache). `TreeMap` / `TreeSet` keep keys sorted, backed by a red-black tree, O(log n) ops — use when you need order + range queries instead of a heap.
```

## Deque (stack, queue, and monotonic deque)

`ArrayDeque` is the go-to — faster than `Stack`/`LinkedList` and not synchronized.

```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);      // add to head
stack.pop();         // remove from head, throws if empty
stack.peek();        // read head, null if empty

Deque<Integer> queue = new ArrayDeque<>();
queue.offer(1);      // add to tail
queue.poll();         // remove from head, null if empty
queue.peek();         // read head, null if empty

// Monotonic deque (sliding window max, etc.) — needs both ends
deque.offerFirst(x); deque.offerLast(x);
deque.pollFirst();   deque.pollLast();
deque.peekFirst();   deque.peekLast();
```

```ad-warning
`pop()`/`push()` on `ArrayDeque` operate on the **head** — so `ArrayDeque` as a stack pushes/pops from the same end you'd `poll()` from as a queue. Don't mix stack and queue method names on the same instance; pick `offer`/`poll` (queue) or `push`/`pop` (stack) and stay consistent.
```

## PriorityQueue (heap)

```java
PriorityQueue<Integer> minHeap = new PriorityQueue<>();               // min-heap by default
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
PriorityQueue<int[]> byFirst = new PriorityQueue<>((a, b) -> a[0] - b[0]);

heap.offer(5);        // add
heap.poll();           // remove + return min/max, null if empty
heap.peek();           // read min/max, null if empty
heap.size();

// Heapify an existing collection in O(n) instead of n offers (O(n log n))
PriorityQueue<Integer> heap = new PriorityQueue<>(list);
```

```ad-warning
`(a, b) -> a[0] - b[0]` overflows if values approach `Integer.MIN_VALUE`/`MAX_VALUE`. Use `Integer.compare(a[0], b[0])` when magnitudes are unbounded.
```

## StringBuilder

```java
StringBuilder sb = new StringBuilder();
sb.append("x").append(5);      // chainable, mixed types
sb.insert(0, "y");              // prepend
sb.deleteCharAt(sb.length() - 1);
sb.reverse();
sb.charAt(i);
sb.setCharAt(i, 'z');
sb.toString();
sb.length();
```

```ad-info
Strings are immutable in Java — `str += c` in a loop is O(n) per append, O(n²) overall. Always use `StringBuilder` when building a string incrementally.
```

## String

```java
s.charAt(i);
s.length();
s.substring(from);              // [from, end)
s.substring(from, to);          // [from, to)
s.split(",");                    // regex-based — escape special chars: split("\\.")
s.toCharArray();
String.valueOf(charArray);
s.equals(other);                 // NEVER use == for content comparison
s.compareTo(other);
s.indexOf('c');                  // -1 if absent
String.join(",", list);
s.trim();
s.toLowerCase(); s.toUpperCase();
Character.isDigit(c); Character.isLetter(c); Character.isLetterOrDigit(c);
Character.toLowerCase(c);
```

```ad-warning
`==` compares references for `String`/boxed types, not content. Two equal-looking strings from different sources can be `==` false. Always use `.equals()`. (Integer caching makes `Integer == Integer` "work" for -128..127 only — another reason to avoid `==` on boxed types entirely.)
```

## Trees & Linked Lists (typical LeetCode node defs)

```java
class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

// Dummy head pattern — avoids special-casing an empty result list
ListNode dummy = new ListNode(0);
ListNode curr = dummy;
// ... curr.next = new ListNode(x); curr = curr.next;
return dummy.next;
```

## Trie

```java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isWord;
}
// index children with c - 'a' for lowercase-letter problems
```

## Union-Find (Disjoint Set Union)

```java
int[] parent = new int[n];
int[] rank = new int[n];
for (int i = 0; i < n; i++) parent[i] = i;

int find(int x) {
    if (parent[x] != x) parent[x] = find(parent[x]); // path compression
    return parent[x];
}

void union(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return;
    if (rank[ra] < rank[rb]) { int t = ra; ra = rb; rb = t; }
    parent[rb] = ra;
    if (rank[ra] == rank[rb]) rank[ra]++;
}
```

## Sorting with Comparator (multi-key, common interval pattern)

```java
// int[][] intervals, sort by start then end
Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);

// List<T> with Comparator.comparing chains
list.sort(Comparator.comparing((int[] a) -> a[0]).thenComparing(a -> a[1]));

// Custom object, descending
people.sort((a, b) -> b.score - a.score);
```

## Bit Manipulation

```java
x & 1                 // check odd/even
x >> 1                // divide by 2
x << 1                // multiply by 2
x & (x - 1)           // clear lowest set bit
x & (-x)              // isolate lowest set bit
Integer.bitCount(x)   // popcount
Integer.toBinaryString(x)
1 << k                 // bit mask for position k
```

## Complexity Cheat Sheet

| Structure          | Access | Search | Insert | Delete |
|---------------------|--------|--------|--------|--------|
| ArrayList            | O(1)   | O(n)   | O(n)*  | O(n)   |
| HashMap/HashSet      | -      | O(1)   | O(1)   | O(1)   |
| TreeMap/TreeSet      | -      | O(log n) | O(log n) | O(log n) |
| ArrayDeque (as stack/queue) | O(1) ends | O(n) | O(1) ends | O(1) ends |
| PriorityQueue        | O(1) peek | O(n) | O(log n) | O(log n) |

*O(1) amortized for append at the end; O(n) for insert/remove at arbitrary index.

---

## References

- https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/package-summary.html
- [[java_concurrency_data_structures]]
