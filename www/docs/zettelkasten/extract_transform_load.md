🗓️ 19112024 1503
📎

# extract_transform_load

> Three distinct stages that enable organizations to **consolidate data** from various sources into a single repository **for analysis and reporting**

## Process Breakdown

### Extraction
- Data is collected from multiple source systems
	- relational databases
	- flat files
	- APIs
	- etc. 
- The extracted data is temporarily stored in a staging area before further processing.
- During this stage, validation rules may be applied to ensure the data meets certain criteria before it proceeds to the next step
    
### Transformation
> Goal: ensure that the data is accurate, consistent, and formatted correctly for analysis    
- In this phase, the extracted data undergoes various transformations to prepare it for loading into the target system. This may involve:
        
- **Data Cleaning**: Correcting inaccuracies and inconsistencies in the data.
- **Data Standardization**: Converting different formats into a unified format.
- **Filtering**: Selecting only relevant attributes for the final dataset.
- **Joining and Splitting**: Combining multiple data sources or splitting fields as necessary.
    
### Loading
    
- Loading the transformed data into a target data repository
	- Data warehouse 
	- Data lake
- This step can be done in batches or in real-time, depending on the requirements of the organization
- The loaded data is then available for business intelligence tools and analytics
## Importance of ETL
- Creating a single source of truth within an organization, allowing for consistent and reliable access to data across various departments
- By consolidating data from disparate sources, ETL enables better decision-making and enhances analytical capabilities

## ETL vs. ELT
It's also important to note the distinction between ETL and ELT (Extract, Load, Transform). In ELT, raw data is first loaded into the target system before transformation occurs. This approach leverages modern cloud technologies that can handle large volumes of raw data efficiently


```ad-summary
ETL is a foundational process in modern data management that facilitates effective analysis by ensuring that diverse datasets are integrated into a coherent and usable format
```

---

# References
- https://www.geeksforgeeks.org/etl-process-in-data-warehouse/
- https://www.informatica.com/sg/resources/articles/what-is-etl.html
- https://www.snowflake.com/guides/what-etl/
