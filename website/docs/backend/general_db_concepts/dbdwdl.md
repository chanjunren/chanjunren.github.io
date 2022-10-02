# Database vs Data Warehouse vs Data Lake

## Database
- Designed to capture and record data through OLTP (online transactional process)
- Live, real-time
- Stored in tables (with rows and columns)
- Highly detailed
- Flexible schema (how data is organized)


## Data Warehouse
- Designed for analytical processing through OLAP (online analytical processing)
- Data is refreshed from source systems - (stores current and historical) through ETL process
    - Data is summarized
- Might not always have current data
- Rigid schema

## DB vs Data Warehouse
| Database | Datawarehouse |
| -------- | ------------- |
| Designed for transactions | Designed for analytics / reporting        |
| Fresh and detailed        | Refreshed periodically, can be summarised |
| Slow for querying large amt of data => slow down transactions | Won't interfere with process => generally faster | 

## Data Lake
- Designed for capturing raw data (structured, semi-structured, unstructured)
- Made for large amounts of data
- Used for ML and AI in its current state / for analytics with procsesing
- Can organize and put into DBs / Datawarehouses
