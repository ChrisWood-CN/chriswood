---
title: istio入门
categories: kubernetes
tags: 
- kubernetes
- istio
---
##简单部署及开放入口
### 安装
minikube安装
> https://minikube.sigs.k8s.io/docs/start/
~~~shell
minikube start
~~~
helm安装istio
> https://istio.io/latest/zh/docs/setup/install/helm/
~~~shell
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm install istio-base istio/base -n istio-system --create-namespace
helm install istiod istio/istiod -n istio-system --wait
helm ls -n istio-system
helm install istio-ingress istio/gateway -n istio-ingress --create-namespace --wait
~~~
### 部署示例应用
~~~shell
#添加标签，Istio在部署应用的时候，自动注入Envoy代理
kubectl create namespace bookinfo
kubectl label namespace bookinfo istio-injection=enabled
~~~
kubectl apply -f [bookinfo.yaml](https://raw.githubusercontent.com/istio/istio/release-1.18/samples/bookinfo/platform/kube/bookinfo.yaml)
kubectl apply -f [bookinfo-gateway.yaml](https://raw.githubusercontent.com/istio/istio/release-1.18/samples/bookinfo/networking/bookinfo-gateway.yaml)

### 开放入口
~~~shell
# 启动istio ingress后需要开启minikube通道访问容器的网络入口
minikube tunnel
# 查看相应地址和端口 并 验证外部访问
kubectl -n istio-ingress get svc istio-ingressgateway -o yaml
~~~
## 配置请求路由
Bookinfo示例包含四个独立的微服务，每个微服务都有多个版本。其中一个微服务reviews的三个不同版本已经部署并同时运行。
在浏览器中访问Bookinfo应用程序的/productpage并刷新几次。有时书评的输出包含星级评分，有时则不包含。这是因为没有
明确的默认服务版本可路由，Istio将以循环方式将请求路由到所有可用版本
### 路由到版本reviews的版本1
有2种实现方式,1.基于k8s规范的gateway.networking.k8s.io/v1beta1，HTTPRoute，2.istio自身的networking.istio.io/v1alpha3，VirtualService
这里用istio自身的VirtualService，需要使用HTTPRoute的参看[官网实现](https://istio.io/latest/zh/docs/tasks/traffic-management/request-routing/)
#### DestinationRule
~~~yaml
--- # DestinationRule - productpage
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: productpage
  namespace: bookinfo
spec:
  host: productpage
  subsets:
    - name: v1
      labels:
        version: v1
--- # DestinationRule - reviews
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: reviews
  namespace: bookinfo
spec:
  host: reviews
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
    - name: v3
      labels:
        version: v3
--- # DestinationRule - ratings
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: ratings
  namespace: bookinfo
spec:
  host: ratings
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
    - name: v2-mysql
      labels:
        version: v2-mysql
    - name: v2-mysql-vm
      labels:
        version: v2-mysql-vm
--- # DestinationRule - details
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: details
  namespace: bookinfo
spec:
  host: details
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
~~~
#### VirtualService
~~~yaml
--- # DestinationRule - productpage
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: productpage
  namespace: bookinfo
spec:
  hosts:
    - productpage
  http:
    - route:
        - destination:
            host: productpage
            subset: v1
--- # DestinationRule - reviews
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
  namespace: bookinfo
spec:
  hosts:
    - reviews
  http:
    - route:
        - destination:
            host: reviews
            subset: v3
--- # DestinationRule - ratings
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
  namespace: bookinfo
spec:
  hosts:
    - ratings
  http:
    - route:
        - destination:
            host: ratings
            subset: v1 #指定目的地
--- # DestinationRule - details
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: details
  namespace: bookinfo
spec:
  hosts:
    - details
  http:
    - route:
        - destination:
            host: details
            subset: v1
~~~
### 基于用户身份的路由
修改并更新VirtualService-reviews
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    route:
    - destination:
        host: reviews
        subset: v2  #来自名为Jason的用户的所有流量将被路由到服务 reviews:v2
  - route:
    - destination:
        host: reviews
        subset: v1
~~~
## 故障注入

### 注入HTTP延迟故障
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    fault:
      delay:
        percentage:
          value: 100.0
        fixedDelay: 7s
    route:
    - destination:
        host: ratings
        subset: v1
  - route:
    - destination:
        host: ratings
        subset: v1
~~~
按照预期，我们引入的7秒延迟不会影响到reviews服务，因为reviews和ratings服务间的超时被硬编码为10秒。 
但是，在productpage和reviews服务之间也有一个3秒的硬编码的超时，再加1次重试，一共6秒。 结果
productpage对reviews的调用在6秒后提前超时并抛出错误。
##### 错误修复：
1.增加 productpage 与 reviews 服务之间的超时或降低 reviews 与 ratings 的超时
2.终止并重启修复后的微服务
3.确认 /productpage 页面正常响应且没有任何错误

### 注入 HTTP abort故障
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - match:
    - headers:
        end-user:
          exact: jason
    fault:
      abort:
        percentage:
          value: 100.0
        httpStatus: 500
    route:
    - destination:
        host: ratings
        subset: v1
  - route:
    - destination:
        host: ratings
        subset: v1
~~~

## 流量转移
如何将流量从微服务的一个版本逐步迁移到另一个版本，把50％的流量发送到reviews:v1，另外，50％的流量发送到reviews:v3。
接着，再把 100％ 的流量发送到 reviews:v3 来完成迁移
先50%过渡，修改并应用VirtualService-reviews
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v1
      weight: 50  #权重路由功能
    - destination:
        host: reviews
        subset: v3
      weight: 50  #权重路由功能
~~~
最后v3版本完全稳定之后，全部修改为v3版本
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
  - route:
    - destination:
        host: reviews
        subset: v3
~~~
## TCP流量转移
如何将TCP流量从微服务的一个版本迁移到另一个版本，把100%的TCP流量分配到tcp-echo:v1。 
接着，再通过配置Istio路由权重把20%的TCP流量分配到tcp-echo:v2
~~~shell
kubectl create namespace istio-io-tcp-traffic-shifting
kubectl label namespace istio-io-tcp-traffic-shifting istio-injection=enabled
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/sleep/sleep.yaml -n istio-io-tcp-traffic-shifting
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/tcp-echo/tcp-echo-services.yaml -n istio-io-tcp-traffic-shifting
#将所有 TCP 流量路由到微服务 tcp-echo 的 v1 版本。
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/tcp-echo/tcp-echo-all-v1.yaml -n istio-io-tcp-traffic-shifting
~~~
~~~yaml
# tcp-echo-all-v1.yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: tcp-echo-gateway
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 31400
      name: tcp
      protocol: TCP
    hosts:
    - "*"
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: tcp-echo-destination
spec:
  host: tcp-echo
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: tcp-echo
spec:
  hosts:
  - "*"
  gateways:
  - tcp-echo-gateway
  tcp:
  - match:
    - port: 31400
    route:
    - destination:
        host: tcp-echo
        port:
          number: 9000
        subset: v1
~~~
~~~shell
export SLEEP=$(kubectl get pod -l app=sleep -n istio-io-tcp-traffic-shifting -o jsonpath={.items..metadata.name})
$ for i in {1..20}; do \
kubectl exec "$SLEEP" -c sleep -n istio-io-tcp-traffic-shifting -- sh -c "(date; sleep 1) | nc $INGRESS_HOST $TCP_INGRESS_PORT"; \
done
~~~
修改并应用VirtualService-tcp-echo
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: tcp-echo
spec:
  hosts:
  - "*"
  gateways:
  - tcp-echo-gateway
  tcp:
  - match:
    - port: 31400
    route:
    - destination:
        host: tcp-echo
        port:
          number: 9000
        subset: v1
      weight: 80
    - destination:
        host: tcp-echo
        port:
          number: 9000
        subset: v2
      weight: 20 #20%流量转移到v2版本
~~~
## 设置请求超时
### 请求超时
HTTP 请求的超时可以用路由规则的 timeout 字段来指定。默认情况下，超时是禁用的，把reviews
服务的超时设置为 1 秒。 为了观察效果，还需要在对 ratings 服务的调用上人为引入2秒的延迟
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ratings
spec:
  hosts:
  - ratings
  http:
  - fault: 
      delay:
        percent: 100
        fixedDelay: 2s # 人为引入2秒的延迟
    route:
    - destination:
        host: ratings
        subset: v1
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: reviews
spec:
  hosts:
    - reviews
  http:
    - route:
        - destination:
            host: reviews
            subset: v2
      timeout: 0.5s # 设置超时为0.5s
# 刷新 Bookinfo 页面。应该看到 1秒钟就会返回，但 reviews是不可用的
# 即使超时配置为半秒，响应仍需要 1 秒，是因为 productpage 服务中存在硬编码重试， 
# 因此它在返回之前调用 reviews 服务超时两次
~~~
## 熔断
如何为连接、请求以及异常检测配置熔断，配置熔断规则，然后通过有意的使熔断器“跳闸”来测试配置
~~~shell
kubectl label namespace default istio-injection=enabled
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/httpbin/httpbin.yaml
~~~
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: httpbin
spec:
  host: httpbin
  trafficPolicy:
    connectionPool:
      tcp:
        maxConnections: 1
      http:
        http1MaxPendingRequests: 1
        maxRequestsPerConnection: 1
    outlierDetection:
      consecutive5xxErrors: 1
      interval: 1s
      baseEjectionTime: 3m
      maxEjectionPercent: 100
~~~
创建客户端
~~~shell
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/httpbin/sample-client/fortio-deploy.yaml -n  
export FORTIO_POD=$(kubectl get pods -l app=fortio -o 'jsonpath={.items[0].metadata.name}')
kubectl exec "$FORTIO_POD" -c fortio -- /usr/bin/fortio curl -quiet http://httpbin:8000/get
~~~
触发熔断器
~~~shell
kubectl exec "$FORTIO_POD" -c fortio -- /usr/bin/fortio load -c 2 -qps 0 -n 20 -loglevel Warning http://httpbin:8000/get
kubectl exec "$FORTIO_POD" -c fortio -- /usr/bin/fortio load -c 3 -qps 0 -n 30 -loglevel Warning http://httpbin:8000/get
#开始看到预期的熔断行为
#查询istio-proxy状态以了解更多熔断详情
kubectl exec "$FORTIO_POD" -c istio-proxy -- pilot-agent request GET stats | grep httpbin | grep pending
~~~
## 流量镜像
流量镜像，也称为影子流量，是一个以尽可能低的风险为生产带来变化的强大的功能。 镜像会将实时流量的副本发送到镜像服务。
镜像流量发生在主服务的关键请求路径之外。首先把流量全部路由到测试服务的v1版本。然后，执行规则将一部分流量镜像到v2版本
~~~yaml
--- #httpbin-v1
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpbin-v1
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpbin
      version: v1
  template:
    metadata:
      labels:
        app: httpbin
        version: v1
    spec:
      containers:
      - image: docker.io/kennethreitz/httpbin
        imagePullPolicy: IfNotPresent
        name: httpbin
        command: ["gunicorn", "--access-logfile", "-", "-b", "0.0.0.0:80", "httpbin:app"]
        ports:
        - containerPort: 80
--- #httpbin-v2
apiVersion: apps/v1
kind: Deployment
metadata:
  name: httpbin-v2
spec:
  replicas: 1
  selector:
    matchLabels:
      app: httpbin
      version: v2
  template:
    metadata:
      labels:
        app: httpbin
        version: v2
    spec:
      containers:
        - image: docker.io/kennethreitz/httpbin
          imagePullPolicy: IfNotPresent
          name: httpbin
          command: ["gunicorn", "--access-logfile", "-", "-b", "0.0.0.0:80", "httpbin:app"]
          ports:
            - containerPort: 80
--- # Service-httpbin
apiVersion: v1
kind: Service
metadata:
  name: httpbin
  labels:
    app: httpbin
spec:
  ports:
    - name: http
      port: 8000
      targetPort: 80
  selector:
    app: httpbin
--- # VirtualService-httpbin
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - httpbin
  http:
    - route:
        - destination:
            host: httpbin
            subset: v1
          weight: 100
--- # DestinationRule-httpbin
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: httpbin
spec:
  host: httpbin
  subsets:
    - name: v1
      labels:
        version: v1
    - name: v2
      labels:
        version: v2
~~~
更新VirtualService-httpbin，镜像流量到 v2
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - httpbin
  http:
  - route:
    - destination:
        host: httpbin
        subset: v1
      weight: 100
    mirror:
      host: httpbin
      subset: v2
    mirrorPercentage:
      value: 100.0
# 这个路由规则发送 100% 流量到 v1 版本。最后一节表示将 100% 的相同流量镜像（即发送）到 httpbin:v2服务。 
# 当流量被镜像时，请求将发送到镜像服务中，并在 headers 中的 Host/Authority 属性值上追加 -shadow。 
# 例如 cluster-1 变为 cluster-1-shadow
~~~

## 地域负载均衡
待完善
## Ingress

## Egress

## 配置
### Gateway
> https://istio.io/latest/zh/docs/reference/config/networking/gateway/#Gateway

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
