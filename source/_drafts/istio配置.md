---
title: istio配置
categories: kubenetes
tags:
- kubernetes
- istio
---
## Gateway
> https://istio.io/latest/zh/docs/reference/config/networking/gateway/

网关描述了在网格边缘运行的负载均衡器，接收传入或传出的 HTTP/TCP 连接.该规范描述了一组应该公开的端口、
要使用的协议类型、负载均衡器的 SNI 配置等.用户需要确保允许流向这些端口的外部流量进入网格，一般是使用
type为LoadBalancer的service.定义好了网关后,然后将 VirtualService 绑定到网关以控制到达特定主机
或网关端口的流量的转发.
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: my-gateway
  namespace: some-config-namespace
spec:
  selector:
    app: my-gateway-controller
  servers:  #Server describes the properties of the proxy on a given load balancer port.
  - port: # Port describes the properties of a specific port of a service.
      number: 80  #暴露端口 80(http)
      name: http
      protocol: HTTP # 端口协议  HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS
    hosts:
    - uk.bookinfo.com   
    - eu.bookinfo.com
    tls: # 服务器tls设置
      httpsRedirect: true # sends 301 redirect for http requests
  - port:
      number: 443 #暴露端口 80(https)
      name: https-443
      protocol: HTTPS
    hosts:
    - uk.bookinfo.com
    - eu.bookinfo.com
    tls:
      mode: SIMPLE # enables HTTPS on this port
      serverCertificate: /etc/certs/servercert.pem
      privateKey: /etc/certs/privatekey.pem
  - port:
      number: 9443  #暴露端口 9443(https)
      name: https-9443
      protocol: HTTPS
    hosts:
    - "bookinfo-namespace/*.bookinfo.com"
    tls:
      mode: SIMPLE # enables HTTPS on this port
      credentialName: bookinfo-secret # fetches certs from Kubernetes secret
  - port:
      number: 9080  #暴露端口 9080(http)
      name: http-wildcard
      protocol: HTTP
    hosts:
    - "*"
  - port:
      number: 2379 #暴露端口 2379 (TCP)
      name: mongo
      protocol: MONGO
    hosts:
    - "*"
~~~

## DestinationRule
> https://istio.io/latest/zh/docs/reference/config/networking/destination-rule/

DestinationRule定义了在路由发生后应用于用于服务的流量的策略.这些规则指定负载平衡的配置、sidecar的连接
池大小以及异常值检测设置，以检测和从负载平衡池中驱逐不健康的主机
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: bookinfo-ratings
spec:
  host: ratings.prod.svc.cluster.local
  trafficPolicy:
    loadBalancer:
      simple: LEAST_REQUEST
~~~
DestinationRule也可以针对特定工作负载进行定制
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: configure-client-mtls-dr-with-workloadselector
spec:
  host: example.com 
  workloadSelector:  #针对特定工作负载
    matchLabels:  #标签搜索的范围仅限于资源所在的配置命名空间
      app: ratings
  trafficPolicy:  # 流量策略
    loadBalancer:
      simple: ROUND_ROBIN
    portLevelSettings:
    - port:
        number: 31443
      tls:
        credentialName: client-credential
        mode: MUTUAL
  subset: #服务端点的子集。子集可用于 A/B 测试或路由到特定版本的服务等场景
    - name: testversion
    labels:  #标签对服务注册表中服务的端点应用过滤器
      version: v3
    trafficPolicy:  #子集级别覆盖服务级别定义的流量策略
      loadBalancer:
        simple: LEAST_CONN
~~~
TrafficPolicy
~~~yaml
trafficPolicy:  # 流量策略
  loadBalancer:  #负载均衡器算法
    simple: ROUND_ROBIN #UNSPECIFIED|RANDOM|PASSTHROUGH|ROUND_ROBIN|LEAST_REQUEST|LEAST_CONN
  connectionPool: #上下游连接设置
    tcp: #tcp设置
      maxConnections: 100
      connectTimeout: 30ms
      tcpKeepalive:
        time: 7200s
        interval: 75s
    http: #http设置
      http2MaxRequests: 1000
      maxRequestsPerConnection: 10
  outlierDetection: #异常检测 驱逐不健康的主机策略
    consecutive5xxErrors: 7
    interval: 5m
    baseEjectionTime: 15m
  portLevelSettings: #特定于各个端口的流量策略，端口级别设置将覆盖目标级别设置，当被端口级设置覆盖时，在目标级指定的流量设置将不会被继承
    - port:
        number: 31443
      tls:
        credentialName: client-credential
        mode: MUTUAL
~~~


## VirtualService
> https://istio.io/latest/zh/docs/reference/config/networking/virtual-service/

影响流量路由的配置,VirtualService定义了一组流量路由规则以在寻址主机时应用,每个路由规则都定义了特定
协议流量的匹配标准.如果流量匹配，则将其发送到注册表中定义的指定目标服务（或其子集/版本）
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews-route
spec:
  hosts:
  - reviews.prod.svc.cluster.local #对应DestinationRule reviews-destination>host
  http:
  - name: "reviews-v2-routes"
    match:
  - headers:
        end-user:
          exact: jason
      uri:
        prefix: "/wpcatalog"
      ignoreUriCase: true
    - uri:
        prefix: "/consumercatalog"
    rewrite:
      uri: "/newcatalog"
    route:
    - destination:
        host: reviews.prod.svc.cluster.local #对应DestinationRule reviews-destination>host
        subset: v2 # 对应subsets>v2
  - name: "reviews-v1-route"
    route:
    - destination:
        host: reviews.prod.svc.cluster.local #对应DestinationRule reviews-destination>host
        subset: v1 # 对应subsets>v1

~~~
路由目的地的子集/版本通过对命名服务子集的引用来标识，该子集必须在相应的DestinationRule中声明
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: reviews-destination
spec:
  host: reviews.prod.svc.cluster.local #host
  subsets:
  - name: v1 #subsets>v1
    labels:
      version: v1
  - name: v2 #subsets>v2
    labels:
      version: v2
~~~
