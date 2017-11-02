from __future__ import print_function
import redis

r = redis.StrictRedis(host='ip', port=6379, db=0, password='pwd')
count=0
# Create the completion sorted set
if r.exists('autoCompleteIndex') == False:
     print "Loading entries in the Redis DB\n"
     f = open('female-names.txt',"r")
     for line in f:
        n = line.strip()
        count = count+1
        print(count)
        for l in range(1,len(n)):
            prefix = n[0:l]
            r.zadd('autoCompleteIndex',0,prefix)
        r.zadd('autoCompleteIndex',0,n+"*")
else:
    print "NOT loading entries, there is already a 'autoCompleteIndex' key\n"
