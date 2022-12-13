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