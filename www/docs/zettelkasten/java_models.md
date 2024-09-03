🗓️ 03092024 1501
📎 #java

# java_models
## POJO (Plain ordinary Java object) 
- Simple Java object without any special restrictions or requirements Can be converted into 
	- `PO` >  After persistence
	- `DTO`  
	- `VO`
## PO (Persistant object) 
- Represents a table record in the database
- Used to map database rows to Java objects
- POs are managed by a persistence framework like Hibernate and typically reflect the database schema.

## VO (Value object) 
- Used to transfer data between different layers, especially in the **presentation** layer (like a web page or UI)
- Encapsulates data that is displayed on the **UI**
- Can be derived from `PO` / `DTO`

## BO (Business Object)
- Encapsulates business logic and can contain multiple POs or other objects
- Represents a business concept, like a customer or order
- May combine data from multiple sources

## DTO (Data Transfer Objects)
- Used to transfer data between processes or over a network, especially in remote calls or APIs
- DTOs often contain a subset of data from one or more POs to avoid exposing the entire database schema.

## DAO (data Access Object)
- Provides an interface for accessing data from a database
- Contains methods for CRUD (Create, Read, Update, Delete) operations 
- Works closely with POs to interact with the database

---

# References
- https://topic.alibabacloud.com/a/java-povobodaodtopojo-explanation_1_27_20218372.html