#
- find all path
```c
match path = (start:conceptNet {name:'/c/en/people'})-[*]-(end:conceptNet {name:'/c/en/person'})
return path limit 2
```

- find path between 2 node
```c
MATCH path = (start:conceptNet {name:'/c/en/people'})-[]->(end:conceptNet {name:'/c/en/person'})
RETURN start, end, count(path) as paths
```

- query relate node
```c
match (s:conceptNet)-[p]->(o)
where s.name = "/c/en/person"
return s,p,o limit 100
```

```c
MATCH (n:conceptNet) where n.name IN ["/c/en/person", "/c/en/people"]
WITH collect(n) as nodes
UNWIND nodes as n
UNWIND nodes as m
WITH * WHERE id(n) < id(m)
MATCH path = (n)-[*..4]-(m)
RETURN path
```