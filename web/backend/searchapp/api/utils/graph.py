from django.conf import settings

graph = getattr(settings, 'GRAPH', None)
if graph == None:
    print("graph does not define in settings.py")

def _extract_value(elm):
    return {
        k: v.get('name',"")
        for k,v in elm.items()
    }

def get_spo(name, limit=100):
    data = graph.query(f"""
        match r=(s)-[p]->(o) 
        where s.name = "{name}"
        return s,p,o limit {limit}
    """)
    return [_extract_value(elm) for elm in data]
    