# 51: CA Search App

* django secret key generate : https://djecrety.ir/
* raw **primekg dataset** : [DSM Google Drive](https://drive.google.com/drive/folders/1q6yjnI3KpZOrzWIFELcgztzV8BQLW7ja?usp=share_link)


# Installation

## Import Data into Neo4j (Admin Import)

1. download files [PrimeKG Dataset](https://drive.google.com/drive/folders/1q6yjnI3KpZOrzWIFELcgztzV8BQLW7ja?usp=share_link)
2. move files into directory **data**  /web/backend/notebook/data
3. copy data from local into docker container Neo4j

SYNTAX.
```bash
docker cp ./data/<SOURCE_FLE>.csv <CONTAINER_ID_OR_NAME>:/var/lib/neo4j/import/<DEST_FILE>.csv
```
EX. 
```bash
docker cp ./data/kg_nodes.csv 51_CA-search-neo4j:/var/lib/neo4j/import/primekg_nodes.csv
docker cp ./data/kg_spo.csv 51_CA-search-neo4j:/var/lib/neo4j/import/primekg_spo.csv
```

4. exec iteractive to docker container neo4j

```bash
docker exec -it 51_CA-search-neo4j bash
```

5. run neo4j admin import (CLI) [more detail (version 4.4)](https://neo4j.com/docs/operations-manual/4.4/tutorial/neo4j-admin-import/)
```bash
bin/neo4j-admin import --force --database=neo4j --nodes=import/primekg_nodes.csv --relationships=import/primekg_spo.csv
```

6. restart docker container neo4j


## Import Data into Django
1. run file jupyter notebook file (/web/backend/notebook/primekg-notebook/02-import-primekg-to-django.ipynb)
