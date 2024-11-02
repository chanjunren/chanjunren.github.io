🗓️ 01112024 2245
📎 #data_processing  #database

# online_analytical_processing


## **How does OLAP work?** 
1. **Collection** -  OLAP server collects data from multiple data sources (RDBs / Data warehouses)
2. **ETL** (Extract, transform, and load) -  Organising / aggregating
	- Use tools clean, aggregate, pre-calculate, and store data in an OLAP cube according to the number of dimensions specified
3. **Analyse** - Use OLAP tools to 
	- query
	- generate reports from the multidimensional data in the OLAP cube

| Terms                              | Description                                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| OLAP Cube                          | **Data structure** to organise / analyse large volumes of data (Optimised for quick and complex analytical queries) |
| Multidimensional Expressions (MDX) | **Queries** for manipulating DBs                                                                                    |

## OLAP types

### Multidimensional online analytical processing (MOLAP)

1. **Creating a data cube** - represents multidimensional data from a data warehouse
2.  MOLAP system stores **precalculated data** in the hypercube
3. **Data engineers** use MOLAP because this type of OLAP technology provides **fast analysis** 

### Relational online analytical processing (ROLAP)
1. (ROLAP) allows data engineers to perform multidimensional data analysis on a **relational database**
2. Data engineers use SQL queries to 
	- retrieve specific information based on the required dimensions
1. Suitable for analyzing **extensive and detailed** data
2. **Slow query performance** compared to MOLAP. 

### Hybrid online analytical processing (HOLAP)

1. Combines MOLAP and ROLAP to provide the best of both architectures
2. HOLAP allows data engineers to 
	- quickly retrieve analytical results from a data cube 
	- extract detailed information from relational databases

## Data modeling in OLAP

```ad-summary
Data modeling is the **representation of data** in data warehouses or OLAP databases
```

-  Data modeling is essential in relational online analytical processing (ROLAP) because it analyzes data straight from the relational database
- **Multidimensional data** stored as a [[star_schema]] or [[snowflake_schema]]


## How does OLAP compare with other data analytics methods?

### **Data mining** 

```ad-info
Analytics technology that processes large volumes of historical data to find patterns and insights
```
>  Business analysts use data-mining tools to **discover relationships** within the data and **make accurate predictions** of future trends

```ad-example
- For example, marketers could use data-mining tools to analyze user behaviors from records of every website visit


- They might then use OLAP software to inspect those behaviors from various angles, such as duration, device, country, language, and browser type. 
 
```
****

---

# References
- https://aws.amazon.com/what-is/olap/