from django.conf import settings

graph = getattr(settings, 'GRAPH', None)
if graph == None:
    print("graph does not define in settings.py")

def _extract_value(elm):
    return {
        k: v.get('name',"")
        for k,v in elm.items()
    }

def get_spo(name, page=0, page_size=100):
    data = graph.query(f"""
        match r=(head)-[relation]->(tail) 
        where head.name = "{name}"
        return head,relation,tail 
        order by head.id
        skip {page*page_size}
        limit {page_size}
    """)
    return [_extract_value(elm) for elm in data]

def _extract_path_1(data):
    output = []
    for elm in [x.get('path') for x in data]:
        for relation in elm.relationships:
            output.append({
                'head': relation.start_node.get('name'),
                'relation': relation.get('name'),
                'tail': relation.end_node.get('name')
            })
    return output

def get_relation(ids, hop=2):
    data = graph.query(f"""
        MATCH (n) where n.name IN ["{'","'.join(ids)}"]
        WITH collect(n) as nodes
        UNWIND nodes as n
        UNWIND nodes as m
        WITH * WHERE id(n) < id(m)
        MATCH path = (n)-[r *..{hop}]-(m)
        RETURN path
    """)
    data = data.data()
    return _extract_path_1(data)