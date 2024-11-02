🗓️ 02112024 1230
📎

# olap_operations
 
 > Analytical operations performed by BAs with a MOLAP ([[olap]]) cube

## Roll up
1. (OLAP) system **summarizes** the data for specific attributes (less detailed)
2. e.g. viewing product sales according of a specific regions

## Drill down
- Opposite of the roll-up operation
- Business analysts move downward in the concept hierarchy and extract the details they require

```ad-example
Move from viewing sales data by **years** -> months 
```

## Slice

For creating a **two-dimensional view** from the OLAP cube

```ad-example
A MOLAP cube sorts data according to products, cities, and months

By slicing the cube, data engineers can create a spreadsheet-like table consisting of **products and cities for a specific month**
```

## Dice

Creating a **smaller subcube** from an OLAP cube 

## Pivot

**Rotating the OLAP cube along one of its dimensions** to get a different perspective on the multidimensional data model


---

# References
- https://aws.amazon.com/what-is/olap/
