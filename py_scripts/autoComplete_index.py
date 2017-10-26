import redis

r = redis.StrictRedis(host='localhost', port=6379, db=0)

# Create the completion sorted set
if r.exists('autoCompleteIndex') == False:
     print "Loading entries in the Redis DB\n"
     f = open('female-names.txt',"r")
     for line in f:
        n = line.strip()
        for l in range(1,len(n)):
            prefix = n[0:l]
            r.zadd('autoCompleteIndex',0,prefix)
        r.zadd('autoCompleteIndex',0,n+"*")
else:
    print "NOT loading entries, there is already a 'autoCompleteIndex' key\n"
