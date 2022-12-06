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
    