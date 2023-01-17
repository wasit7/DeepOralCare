from django.contrib.postgres.search import TrigramSimilarity

def search(model, fields, word):
    
    data = model.objects.annotate(similarity=TrigramSimilarity(*fields, word)).filter(similarity__gt=0.3).order_by('-similarity')
    return data[:100]