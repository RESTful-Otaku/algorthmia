# New Project: Algorithm Visualisation Web App

## Name: **Algorthmia**

### Tech Stack:
- **Backend**: Golang
- **Frontend**: Svelte, TypeScript, Bun

---

## Overview:

### Backend:
The backend will handle:
- Receiving parameters, generating inputs, executing algorithms, and communicating with the frontend.
- A **unified API** and **architecture** for all visualizations.
- **Consistency**, **reliability**, and **performance** are key goals.
- Should be **fast**, **dependable**, and **minimal** in design.
- Utilize **multi-threading** where necessary to ensure performance.

### Frontend:
The frontend will enable users to:
- Choose from a list of algorithms with **fuzzy search** and filters.
- Configure parameters for each algorithm (with default values).
- Visualize algorithm execution with interactive controls:
  - **Generate**, **Play**, **Step Through**, **Reset**, **Play Speed Control** (x1, x2, x4, ..., x512).
- Toggle between **light** and **dark** themes.
- Receive **notifications** (informing users of errors or important actions).
- Maintain **consistent theming** across UI components (buttons, widgets, transitions).

---

## Key Features:
- **Header**: Includes logo, app title, version, selected algorithm description, and Big O notation.
- **Left Panel**: Collapsible hamburger menu for Algorithm and Parameter Configuration.
- **Right Panel**: Main visualizer area with interactive controls.
- **Notifications**: Inform users of critical events or algorithm progress.

---

## Algorithm Categories & Algorithms

### 🔢 Sorting (Top 5)
1. **Bubble Sort** – Simple comparisons/swaps (easy to animate).
2. **Merge Sort** – Divide & conquer, clear split/merge visualization.
3. **Quick Sort** – Pivot-based partitioning, recursive demo.
4. **Heap Sort** – Heap property & priority queues visualization.
5. **Counting Sort** – Non-comparison-based, demonstrates counting buckets.

---

### 🔎 Searching (Top 5)
1. **Linear Search** – Simple brute-force scanning.
2. **Binary Search** – Halving search space visually.
3. **DFS (Depth-First Search)** – Stack-based tree/graph traversal.
4. **BFS (Breadth-First Search)** – Layer-by-layer expansion (queue visualization).
5. **Hash Lookup** – O(1) expected lookup, great for key-value mapping demos.

---

### 🌳 Graphs & Trees (Top 5)
1. **Union-Find (DSU)** – Merge/find groups, easy forest visualization.
2. **Topological Sort** – Task ordering with dependencies.
3. **Tarjan’s SCC** – Strongly connected components, graph condensation.
4. **Prim’s Algorithm** – Greedy MST (Minimum Spanning Tree) growth.
5. **Kruskal’s Algorithm** – MST via edge sorting + union-find.

---

### 🛣️ Pathfinding (Top 5)
1. **Dijkstra’s Algorithm** – Weighted shortest path with distances.
2. **Bellman–Ford** – Shows relaxation, handles negative edges.
3. **A\* (A-Star)** – Heuristic-based search on grids.
4. **Floyd–Warshall** – Matrix-based All-Pairs Shortest Path.
5. **Bidirectional Search** – Two expanding waves meeting in the middle.

---

### 🧮 Dynamic Programming (Top 5)
1. **Fibonacci (DP)** – Memoization vs tabulation (classic intro).
2. **Knapsack (0/1)** – Resource allocation grid visualization.
3. **Longest Common Subsequence (LCS)** – Diff tool demo.
4. **Longest Increasing Subsequence (LIS)** – Stock trend analogy.
5. **Matrix Chain Multiplication** – Parenthesization cost optimization.

---

### 💰 Greedy Algorithms (Top 5)
1. **Activity Selection** – Max non-overlapping tasks selection.
2. **Huffman Coding** – Prefix codes construction (tree visualization).
3. **Kruskal’s MST** – Overlaps with graphs, greedy steps.
4. **Prim’s MST** – Greedy expansion for Minimum Spanning Tree.
5. **Fractional Knapsack** – Ratio-based greedy filling.

---

### 🧩 Strings (Top 5)
1. **Naïve Pattern Search** – Baseline brute-force search.
2. **KMP** – Prefix function with pattern skipping.
3. **Rabin-Karp** – Rolling hash for string matching.
4. **Trie Construction** – Prefix tree, autocomplete demo.
5. **Manacher’s Algorithm** – Palindromic substrings in linear time.

---

### 🔐 Number Theory / Math (Top 5)
1. **Euclidean Algorithm (GCD)** – Repeated remainder steps.
2. **Sieve of Eratosthenes** – Grid-crossing to find primes.
3. **Modular Exponentiation** – Repeated squaring demo.
4. **Chinese Remainder Theorem** – Congruence alignment.
5. **Miller-Rabin** – Randomized primality test.

---

### 🎲 Randomized / Probabilistic (Top 5)
1. **Reservoir Sampling** – One-pass random selection.
2. **Monte Carlo Simulation** – Dartboard π approximation.
3. **Miller-Rabin** – Probabilistic primality.
4. **Bloom Filters** – Set membership with false positives.
5. **Skip Lists** – Randomized layered search structure.

---

### ⚙️ Optimization / Flow (Top 5)
1. **Simplex Algorithm** – Linear programming with pivot steps.
2. **Hungarian Algorithm** – Assignment matrix demo.
3. **Ford–Fulkerson** – Augmenting path max flow.
4. **Dinic’s Algorithm** – Layered network max flow.
5. **Branch & Bound** – Pruning search trees for optimization.

---

## Frontend Interaction & UI Flow

### 1. **Algorithm Selection**:
- Users select algorithms via a **fuzzy-search-enabled** list.
- Algorithms are **categorized** and dynamically filtered based on user input.

### 2. **Algorithm Parameterization**:
- Each algorithm will have configurable parameters (with sensible **default values**).
- Parameters are **dynamically shown** based on the algorithm selected.

### 3. **Algorithm Visualization Controls**:
- **Generate**: Random permutation of inputs.
- **Play/Pause**: Start/stop algorithm execution visualization.
- **Step Scrubber**: Step through execution using a scrollbar.
- **Play Speed**: Dropdown for controlling speed (x1, x2, x4, ..., x512).
- **Reset**: Reset algorithm to the starting state.

### 4. **Theming & Notifications**:
- **Light/Dark Themes**: Users can toggle between themes.
- **Notifications**: Inform users of key events (e.g., algorithm completion, errors, etc.).

---

## Design & UI Consistency

- **Theming**: Consistent design inspired by **Brilliant** and **Visualgo**.
- **Interactive Elements**: Engaging UI with smooth animations, content separation, and transitions.
- **Consistency**: Unified design for buttons, widgets, and transitions to enhance user experience.

---

This markdown guide provides a **clear structure** for the project, covering both **frontend** and **backend** responsibilities, with an emphasis on algorithm categories, user interactions, and overall app design.

Feel free to tweak or expand any section to fit specific requirements or additional features! Let me know if you need anything further.
