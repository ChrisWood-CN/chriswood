---
title: RedisTemplate的opsFor操作
date: 2023-03-07 10:04:31
categories:
- Redisson
- RedisTemplate
tags:
- Redisson
- RedisTemplate
---
#### 一、opsForValue
Key-Value操作
##### 1、set(K key, V value)
向Redis新增一个key-value，k-v可以是泛型。
~~~java
redisTemplate.opsForValue().set(obj1,obj2);
~~~
##### 2.get(Object key)
~~~java
// 以对象为key的，只要对象属性全都相同就可以获取到
redisTemplate.opsForValue().get(obj1);
~~~
##### 3、set(K key, V value, long timeout, TimeUnit unit)
在原有的set基础上增加了过期时间,过了这个时间,这对key-value就会被Redis删除
~~~
// 300秒后过期
redisTemplate.opsForValue().set(obj1,obj2,300,TimeUnit.SECONDS);
~~~
4.append(K key, String value)
在原有的值基础上新增字符串到末尾
5.get(K key, long start, long end) 
截取key键对应值得字符串，从开始下标位置开始到结束下标的位置(包含结束下标)的字符串
6.getAndSet(K key, V value)
获取原来key键对应的值并重新赋新值
7.setBit(K key, long offset, boolean value)
key键对应的值value对应的ascii码,在offset的位置(从左向右数)变为value。
~~~
redisTemplate.opsForValue().setBit("key",1,false); 
~~~
8.getBit(K key, long offset)
断指定的位置ASCII码的bit位是否为1
~~~
boolean bitBoolean = redisTemplate.opsForValue().getBit("key",1); 
~~~
9.size(K key)
获取指定字符串的长度
10.increment(K key, double delta),increment(K key, long delta)
以增量的方式将double,long值存储在变量中
~~~
double valueDouble = redisTemplate.opsForValue().increment("doubleKey",5);  
~~~
11.setIfAbsent(K key, V value)
如果键不存在则新增,存在则不改变已经有的值
12.set(K key, V value, long offset)
覆盖从指定位置开始的值
13.multiSet(Map<? extends K,? extends V> map)
设置map集合到redis
~~~java
Map valueMap = new HashMap();  
valueMap.put("valueMap1","map1");  
valueMap.put("valueMap2","map2");  
valueMap.put("valueMap3","map3");  
redisTemplate.opsForValue().multiSet(valueMap);  
~~~
14.multiGet(Collection<K> keys)
根据集合的keys取出对应的value值
~~~
//根据List集合取出对应的value值  
List paraList = new ArrayList();  
paraList.add("valueMap1");  
paraList.add("valueMap2");  
paraList.add("valueMap3");  
List<String> valueList = redisTemplate.opsForValue().multiGet(paraList);  
for (String value : valueList){  
    System.out.println("通过multiGet(Collection<K> keys)方法获取map值:" + value);  
}
~~~
15.multiSetIfAbsent(Map<? extends K,? extends V> map)
如果对应的map集合名称不存在，则添加；如果存在则不做修改

#### 二、opsForList
List集合相关操作。
##### 1、leftPush(K key, V value) / rightPush(K key, V value)
向集合左边添加元素值
~~~
// list：[c,b,a]
redisTemplate.opsForList().leftPush("list","a");
redisTemplate.opsForList().leftPush("list","b");
redisTemplate.opsForList().leftPush("list","c");
~~~
##### 2.leftPushAll(K key, V …values) / rightPushAll(K key, V …values)
向集合左边批量添加元素，参数可以是数组、多参数、集合
##### 3.leftPop(K key) / rightPop(K key, V …values)
移除集合左边的第一个元素并返回这个元素
4.index(K key, long index)
获取集合指定位置的值
5.range(K key, long start, long end)
获取指定区间的值
6.ize(K key)
获取集合长度
7.leftPop(K key, long timeout, TimeUnit unit) / rightPop(K key, long timeout, TimeUnit unit)
移除集合中左边的元素在等待的时间里，如果超过等待的时间仍没有元素则退出
8.trim(K key, long start, long end)
截取集合元素长度，保留长度内的数据
9.remove(K key, long count, Object value)
从存储在键中的列表中删除等于值的元素的第一个计数事件。
count> 0：删除等于从左到右移动的值的第一个元素；
count< 0：删除等于从右到左移动的值的第一个元素；
count = 0：删除等于value的所有元素。

#### 三、opsForHash
Hash类型相关操作
##### 1、put(H key, HK hashKey, HV value)
新增一个Hash值，key为外层的Hash的key值，hashKey为内层Hash的key值，value为内层Hash的key对应的value
##### 2.get(H key, Object hashKey)
获取内层hashKey对应的value
##### 3.values(H key)
获取外层Key的存储的所有hash，并将其封装在一个Map对象返回
##### 4.hasKey(H key, Object hashKey)
判断Key中是否存在hashKey这个键值对
##### 5.keys(H key)、values(H key)
前者获取所有key，后者获取所有key对应的value
##### 6.size(H key)
获取Hash的长度
##### 7.putAll(H key, Map<? extends HK,? extends HV> m)
以Map集合的形式添加键值对

#### 四、opsForSet
Set类型相关操作
##### 1、add(K key, V… values)
向key对应的value值中批量添加值，可以是集合、数组、多参数
##### 2.members(K key)
获取key对应的value
~~~
Set set = redisTemplate.opsForSet().members("key");
~~~
##### 3、size(K key)
获取key对应的值的长度
##### 4、isMember(K key, Object o)
检查给定的元素是否在Set变量中
##### 5、pop(K key)
弹出变量中的元素
##### 6、remove(K key, Object… values)
批量移除元素。可以是集合、数组、多参数
##### 7、randomMember(K key)
随机获取变量中的一个元素
##### 8、randomMembers(K key, long count)
随机获取变量中的count个元素
##### 9、delete(H key, Object… hashKeys)
删除Key变量中的键值对，可以传入多个参数，删除多个键值对。可以是集合、数组、多参数

#### 五、opsForZSet
ZSet相关操作,根据score分数进行从小到大排序
##### 1、add(K key, V value, double score)
添加元素到变量中同时指定元素的分值
~~~
redisTemplate.opsForZSet().add("zSetKey","A",1);
redisTemplate.opsForZSet().add("zSetKey","B",3);
~~~
##### 2、range(K key, long start, long end)
获取变量指定区间的元素，从下标0开始
##### 3、score(K key, Object o)
获取元素的分值
##### 4.rangeByScore(K key, double min, double max)
根据设置的score获取区间值。
##### 5.rangeByScore(K key, double min, double max,long offset, long count)
根据设置的score获取区间值从给定下标和给定长度获取最终值。
##### 6.count(K key, double min, double max)
获取区间值的个数

#### 所有的键值对都可以通过delete删除
~~~
// 删除一个Key
redisTemplate.delete("Key");
// 删除多个Key - 可以是集合、数组、多参数
redisTemplate.delete(list);
~~~
