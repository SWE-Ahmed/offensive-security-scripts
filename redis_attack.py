import redis
import time
# Connect to the Redis server 
r = redis.Redis(host='localhost', port=6109)

# Create an entry
key = "balance"
value = "1000"
r.set(key, value)

# Retreive the entry
result = r.get(key)
print(result)

# Vulnerable command to be executed
vulnerable_input = "GET balance'; EVAL 'return redis.call('keys', '*')'" 
result = r.execute_command(vulnerable_input)

# Output result
print(result)
