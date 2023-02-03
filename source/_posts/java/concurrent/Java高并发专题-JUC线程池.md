---
title: Java高并发专题-JUC线程池
date: 2022-10-08 16:55:43
categories: 
- Java高并发
- JUC
tags: 
- Java高并发
- JUC
---
### 线程池
#### Executor框架接口
- Executors.newCachedThreadPool() 创建缓存线程池
```java
public class ThreadPoolExample1 {

    public static void main(String[] args) {

        ExecutorService executorService = Executors.newCachedThreadPool();

        for (int i = 0; i < 10; i++) {
            final int index = i;
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    log.info("task:{}", index);
                }
            });
        }
        executorService.shutdown();
    }
}
```
- Executors.newFixedThreadPool(3) 创建定长线程池
```java
public class ThreadPoolExample2 {

    public static void main(String[] args) {

        ExecutorService executorService = Executors.newFixedThreadPool(3);

        for (int i = 0; i < 10; i++) {
            final int index = i;
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    log.info("task:{}", index);
                }
            });
        }
        executorService.shutdown();
    }
}
```
- Executors.newSingleThreadExecutor() 创建单线程线程池
```java
public class ThreadPoolExample3 {

    public static void main(String[] args) {

        ExecutorService executorService = Executors.newSingleThreadExecutor();

        for (int i = 0; i < 10; i++) {
            final int index = i;
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    log.info("task:{}", index);
                }
            });
        }
        executorService.shutdown();
    }
}
```
- Executors.newScheduledThreadPool(1) 创建定长线程池，支持定时，周期性的任务执行
```java
public class ThreadPoolExample4 {

    public static void main(String[] args) {

        ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

        executorService.scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
                log.warn("schedule run");
            }
        }, 1, 3, TimeUnit.SECONDS);
        
//        executorService.shutdown();

        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                log.warn("timer run");
            }
        }, new Date(), 5 * 1000);
    }
}
```
前面三种线程池都是直接创建ThreadPoolExecutor类的对象。ScheduledThreadPool 因为要实现定时功能，创建的是 ScheduledThreadPoolExecutor 类的对象。但 ScheduledThreadPoolExecutor 也是继承自ThreadPoolExecutor 。
下面这个构造方法是参数最全的一个创建线程池的源码。
```java
/**
 * Creates a new {@code ThreadPoolExecutor} with the given initial
 * parameters.
 *
 * @param corePoolSize 线程池中维持的线程数量。
 *                     当线程数量不超过这个数时，即使线程处于空闲状态也不会被销毁，会一直等待任务到来。
 *                     但是如果设置 allowCoreThreadTimeOut 为 true，corePoolSize 就不再有效了。
 * @param maximumPoolSize 线程池中线程的最大数量。
 * @param keepAliveTime 当线程数量超过了 corePoolSize 时，多余的线程销毁前等待的时间。
 * @param unit keepAliveTime 的时间单位
 * @param workQueue 用来管理待执行任务的队列。
 * @param threadFactory 创建线程的工厂。
 * @param handler RejectedExecutionHandler 接口的实现对象。用于处理任务被拒绝执行的情况。
 *                被拒绝的原因可能是所有线程正在执行任务而任务队列容量又满了
 */
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    ...
}
```
