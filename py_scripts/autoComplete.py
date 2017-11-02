import redis

r = redis.StrictRedis(host='ip', port=6379, db=0, password='pwd')

def complete(r,prefix,count):
    results = []
    rangelen = 50 # This is not random, try to get replies < MTU size
    start = r.zrank('autoCompleteIndex',prefix)
    if not start:
         return []
    while (len(results) != count):
         range = r.zrange('autoCompleteIndex',start,start+rangelen-1)
         start += rangelen
         if not range or len(range) == 0:
             break
         for entry in range:
             minlen = min(len(entry),len(prefix))
             if entry[0:minlen] != prefix[0:minlen]:
                count = len(results)
                break
             if entry[-1] == "*" and len(results) != count:
                results.append(entry[0:-1])

    return results

def autoComplete():
    print complete(r,"marcell",50)

if __name__ == "__main__":
    autoComplete()
