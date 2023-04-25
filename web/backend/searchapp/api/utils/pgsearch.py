from django.contrib.postgres.search import TrigramSimilarity

def search(model, fields, word):
    data = model.objects.annotate(similarity=TrigramSimilarity(*fields, word)).filter(similarity__gt=0.3).order_by('-similarity')
    return data[:100]

def search_disease(model, fields, word):
    data = model.objects.filter(label__name="Disease").annotate(similarity=TrigramSimilarity(*fields, word)).filter(similarity__gt=0.1).order_by('-similarity')
    return data[:100]

def search_exposure(model, fields, word):
    data = model.objects.filter(label__name="Exposure").annotate(similarity=TrigramSimilarity(*fields, word)).filter(similarity__gt=0.1).order_by('-similarity')
    return data[:100]