from django.conf import settings
from .model_choices import mapping_relation_name

graph = getattr(settings, 'GRAPH', None)
if graph == None:
    print("graph does not define in settings.py")

def _extract_value(elm):
    return {
        k: v.get('id', v.get('name'))
        for k,v in elm.items()
    }

def get_spo(id, page=0, page_size=50):
    data = graph.query(f"""
        match path=allshortestpaths((head)-[relation*..5]->(tail:Exposure) )
        where head.id = "{id}"
        return path
        order by head.id
        skip {page*page_size}
        limit {page_size}
    """)
    # return [_extract_path_1(elm) for elm in data]
    return _extract_path_1(data)

def _extract_path_1(data):
    output = []
    for elm in [x.get('path') for x in data]:
        for relation in elm.relationships:
            output.append({
                'head': relation.start_node.get('id'),
                'relation': relation.get('name'),
                'tail': relation.end_node.get('id')
            })
    return output

def unique_node_ids(spo):
    data = [elm.get('head') for elm in spo] + [elm.get('tail') for elm in spo]
    return list(set(data))

def serialize_path(data):
    output = []
    for path in data:
        txt = ""
        for relation in path['path'].relationships:
            txt += f"{relation.start_node.get('name')} {relation.get('name', '')} {relation.end_node.get('name')}, "
        output.append(txt)
    return output

def get_relation(ids, hop=2):
    if len(ids) == 1:
        return get_spo(id=ids[0]), []
    
    cypher_query = f"""
        MATCH path=allshortestpaths((n)-[r*..{hop}]->(m))
        WHERE n.id = "{ids[0]}" and m.id ="{ids[1]}"
        RETURN path
    """
    # cypher_query = f"""
    #      MATCH (n) where n.id IN ["{'","'.join(ids)}"]
    #      WITH collect(n) as nodes
    #      UNWIND nodes as n
    #      UNWIND nodes as m
    #      WITH * WHERE id(n) < id(m)
    #      MATCH path = allshortestpaths((n)-[r *..{hop}]->(m))
    #      RETURN path
    #  """
    query = graph.query(cypher_query)
    data = query.data()
    return _extract_path_1(data), serialize_path(data)