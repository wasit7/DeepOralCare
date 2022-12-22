from django.contrib.postgres.search import SearchVector

def search(model, fields, word):
    # data = model.objects.annotate(search=SearchVector(*fields)).filter(search=word)[:1000]
    data = model.objects.filter(name__icontains=word)
    if data.count() > 1000:
        data = model.objects.filter(name__iexact=word)
    return data[:100]