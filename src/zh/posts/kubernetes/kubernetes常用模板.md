---
title: kubernetes常用模板 
date: 2023-05-18 14:56:26
categories: kubernetes 
tags:
- kubernetes
- template
---

### Deployment

Deployment是Kubernetes系统的⼀个核⼼概念，主要职责和RC⼀样的都是保证Pod的数量和健康， 二者⼤部分功能都是完全⼀致，可以看成是⼀个升级版的RC控制器

- 确保 Pod 数量
- 确保 Pod 健康
- 事件和状态查看
- 回滚
- 版本记录
- 暂停和启动

~~~yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-container
          image: my-image
          ports:
            - containerPort: 80
~~~

### Service

Service是⼀种抽象的对象，它定义了⼀组Pod的逻辑集合和⼀个⽤于访问它们的策略，其实这个概念和微服务⾮常类似。 ⼀个Serivce下⾯包含的Pod集合⼀般是由LabelSelector来决定的

~~~yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: my-app
  ports:
    - name: http
      port: 80
      targetPort: 80
  type: ClusterIP
~~~

### Horizontal Pod Autoscaler（HPA）

通过⼿⼯执⾏kubectl scale命令和在Dashboard上操作可以实现Pod的扩缩容，但纯手工方式不现实， Kubernetes提供了这样⼀个资源对象：Horizontal Pod
Autoscaling（Pod⽔平⾃动伸缩）。HPA通过 监控分析RC或者Deployment控制的所有Pod的负载变化情况来确定是否需要调整Pod的副本数量。
HPA根据CPU利用率、内存利用率等指标自动扩容或缩容Pod的副本数量，从而保证应用程序的性能和可用性。

~~~yaml
#autoscaling/v1版本
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: my-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-deployment
  minReplicas: 1
  maxReplicas: 10
  targetCPUUtilizationPercentage: 90
~~~

~~~yaml
#autoscaling/v2版本
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: my-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: my-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 90
    - type: Resource
      resource:
        name: memory
        target:
          type: AverageValue
          averageValue: 1000Mi
~~~
### Ingress
Ingress将外部流量路由到Kubernetes集群内部的Service或Pod中
~~~yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-ingress
  annotations:
    #  使用了nginx.ingress.kubernetes.io/rewrite-target注解，将请求的路径重写为/，从而避免了请求的路径中包含/my-app
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: example.com
    http:
      paths:
      - path: /my-app
        pathType: Prefix
        backend:
          service:
            name: my-service
            port:
              name: http
~~~
