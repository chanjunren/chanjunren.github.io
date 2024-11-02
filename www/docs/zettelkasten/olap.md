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

Data mining is analytics technology that processes large volumes of historical data to find patterns and insights. Business analysts use data-mining tools to discover relationships within the data and make accurate predictions of future trends.

#### **_OLAP and data mining_**

Online analytical processing **(**OLAP) is a database analysis technology that involves querying, extracting, and studying summarized data. On the other hand, data mining involves looking deeply into unprocessed information. For example, marketers could use data-mining tools to analyze user behaviors from records of every website visit. They might then use OLAP software to inspect those behaviors from various angles, such as duration, device, country, language, and browser type. 

### **OLTP**

Online transaction processing (OLTP) is a data technology that stores information quickly and reliably in a database. Data engineers use OLTP tools to store transactional data, such as financial records, service subscriptions, and customer feedback, in a relational database. OLTP systems involve creating, updating, and deleting records in relational tables. 

#### **_OLAP and OLTP_**

OLTP is great for handling and storing multiple streams of transactions in databases. However, it cannot perform complex queries from the database. Therefore, business analysts use an OLAP system to analyze multidimensional data. For example, data scientists connect an [OLTP database to a cloud-based OLAP cube](https://aws.amazon.com/blogs/architecture/building-a-cloud-based-olap-cube-and-etl-architecture-with-aws-managed-services/) to perform compute-intensive queries on historical data.

## How does AWS help with OLAP?

[AWS databases](https://aws.amazon.com/products/databases/) provide various managed cloud databases to help organizations store and perform online analytical processing **(**OLAP) operations. Data analysts use AWS databases to build secure databases that align with their organization's requirements. Organizations migrate their business data to AWS databases because of the affordability and scalability. 

- [Amazon Redshift](https://aws.amazon.com/redshift/) is a cloud data warehouse designed specifically for online analytical processing.
- [Amazon Relational Database Service (Amazon RDS)](https://aws.amazon.com/rds/?c=db&sec=srv) is a relational database with OLAP functionality. Data engineers use Amazon RDS with Oracle OLAP to perform complex queries on dimensional cubes.
- [Amazon Aurora](https://aws.amazon.com/rds/aurora/?c=db&sec=srv) is a MySQL- and PostgreSQL-compatible cloud relational database. It is optimized for running complex OLAP workloads.

  
Get started with OLAP on AWS by creating an [AWS account](https://portal.aws.amazon.com/gp/aws/developer/registration/index.html?nc2=h_ct&src=header_signup) today.

---

# References
- https://aws.amazon.com/what-is/olap/