from django.contrib.postgres.search import SearchVector

def search(model, fields, word):
    data = model.objects.annotate(search=SearchVector(*fields)).filter(search__icontains=word)
    return data