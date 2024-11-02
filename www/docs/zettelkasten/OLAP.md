🗓️ 01112024 2245
📎 #data_processing 

# online_analytical_processing


## **How does OLAP work?** 
1. **Collection** -  OLAP server collects data from multiple data sources (RDBs / Data warehouses)
2. **ETL** (Extract, transform, and load) -  Organising / aggregating
	- Use tools clean, aggregate, pre-calculate, and store data in an OLAP cube according to the number of dimensions specified
3. **Analyse** - Use OLAP tools to 
	- query
	- generate reports from the multidimensional data in the OLAP cube

| Terms                              | Description                                                                                                     |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| OLAP Cube                          | Data structure to organise / analyse large volumes of data (Optimised for quick and complex analytical queries) |
| Multidimensional Expressions (MDX) | Queries for manipulating DBs                                                                                    |

## OLAP types


### **MOLAP**

Multidimensional online analytical processing (MOLAP) involves creating a data cube that represents multidimensional data from a data warehouse. The MOLAP system stores precalculated data in the hypercube. Data engineers use MOLAP because this type of OLAP technology provides fast analysis. 

### **ROLAP**

Instead of using a data cube, relational online analytical processing (ROLAP) allows data engineers to perform multidimensional data analysis on a relational database. In other words, data engineers use SQL queries to search for and retrieve specific information based on the required dimensions. ROLAP is suitable for analyzing extensive and detailed data. However, ROLAP has slow query performance compared to MOLAP. 

### **HOLAP**

Hybrid online analytical processing (HOLAP) combines MOLAP and ROLAP to provide the best of both architectures. HOLAP allows data engineers to quickly retrieve analytical results from a data cube and extract detailed information from relational databases. 

## What is data modeling in OLAP?

Data modeling is the representation of data in data warehouses or online analytical processing (OLAP) databases. Data modeling is essential in relational online analytical processing (ROLAP) because it analyzes data straight from the relational database. It stores multidimensional data as a star or snowflake schema. 

### **Star schema**

The star schema consists of a fact table and multiple dimension tables. The fact table is a data table that contains numerical values related to a business process, and the dimension table contains values that describe each attribute in the fact table. The fact table refers to dimensional tables with foreign keys—unique identifiers that correlate to the respective information in the dimension table. 

In a star schema, a fact table connects to several dimension tables so the data model looks like a star. The following is an example of a fact table for product sales: 

- Product ID
- Location ID
- Salesperson ID
- Sales amount

The product ID tells the database system to retrieve information from the product dimension table, which might look as follows:

- Product ID
- Product name
- Product type
- Product cost

Likewise, the location ID points to a location dimension table, which could consist of the following:

- Location ID
- Country
- City

The salesperson table might look as follows:

- Salesperson ID
- First name
- Last name
- Email

### **Snowflake schema**

The snowflake schema is an extension of the star schema. Some dimension tables might lead to one or more secondary dimension tables. This results in a snowflake-like shape when the dimension tables are put together. 

For example, the product dimension table might contain the following fields:

- Product ID
- Product name
- Product type ID
- Product cost

The product type ID connects to another dimension table as shown in the following example:

- Product type ID
- Type name
- Version
- Variant 

## What are OLAP operations?

Business analysts perform several basic analytical operations with a multidimensional online analytical processing (MOLAP) cube. 

### **Roll up**

In roll up, the online analytical processing (OLAP) system summarizes the data for specific attributes. In other words, it shows less-detailed data. For example, you might view product sales according to New York, California, London, and Tokyo. A roll-up operation would provide a view of the sales data based on countries, such as the US, the UK, and Japan. 

### **Drill down**

Drill down is the opposite of the roll-up operation. Business analysts move downward in the concept hierarchy and extract the details they require. For example, they can move from viewing sales data by years to visualizing it by months.

### **Slice**

Data engineers use the slice operation to create a two-dimensional view from the OLAP cube. For example, a MOLAP cube sorts data according to products, cities, and months. By slicing the cube, data engineers can create a spreadsheet-like table consisting of products and cities for a specific month. 

### **Dice**

Data engineers use the dice operation to create a smaller subcube from an OLAP cube. They determine the required dimensions and build a smaller cube from the original hypercube.

### **Pivot**

The pivot operation involves rotating the OLAP cube along one of its dimensions to get a different perspective on the multidimensional data model. For example, a three-dimensional OLAP cube has the following dimensions on the respective axes:

- X-axis—product 
- Y-axis—location
- Z-axis—time

Upon a pivot, the OLAP cube has the following configuration:

- X-axis—location
- Y-axis—time
- Z-axis—product

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