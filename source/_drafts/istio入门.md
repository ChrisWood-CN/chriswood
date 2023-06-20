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
控制 Istio 服务网格的入口流量
### 入口网关
除了支持 Kubernetes Ingress，Istio还提供了另一种配置模式，Istio Gateway。与 Ingress 相比，Gateway 
提供了更广泛的自定义和灵活性，并允许将 Istio 功能（例如监控和路由规则）应用于进入集群的流量
#### 使用网关配置 Ingress
~~~shell
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/httpbin/httpbin.yaml
~~~
为 HTTP 流量在 80 端口上配置 Gateway
~~~yaml
---
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingressgateway # use Istio default gateway implementation
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts: # "*"
    - "httpbin.example.com"  
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts: # "*"
    - "httpbin.example.com"   
  gateways:
    - httpbin-gateway #绑定网关
  http:
    - match:
        - uri:
            prefix: /status
        - uri:
            prefix: /delay
      route:
        - destination:
            port:
              number: 8000
            host: httpbin
~~~
##### 确定 Ingress IP 和端口
每个Gateway由类型为LoadBalancer的服务支撑，该服务的外部负载均衡器 IP 和端口用于访问 Gateway。
~~~shell
kubectl get svc istio-ingressgateway -n istio-ingress
# 得到$INGRESS_HOST和$INGRESS_PORT
~~~
#### 访问 Ingress 服务
~~~shell
curl -s -I -HHost:httpbin.example.com "http://$INGRESS_HOST:$INGRESS_PORT/status/200"
~~~
### 安全网关
描述如何使用TLS或mTLS公开安全的HTTPS服务。
~~~shell
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/httpbin/httpbin.yaml
~~~
#### 生成客户端和服务器证书和密钥
~~~shell
#创建用于服务签名的根证书和私钥
mkdir example_certs1
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example_certs1/example.com.key -out example_certs1/example.com.crt
#为 httpbin.example.com 创建证书和私钥
openssl req -out example_certs1/httpbin.example.com.csr -newkey rsa:2048 -nodes -keyout example_certs1/httpbin.example.com.key -subj "/CN=httpbin.example.com/O=httpbin organization"
openssl x509 -req -sha256 -days 365 -CA example_certs1/example.com.crt -CAkey example_certs1/example.com.key -set_serial 0 -in example_certs1/httpbin.example.com.csr -out example_certs1/httpbin.example.com.crt
#创建第二组相同类型的证书和密钥
mkdir example_certs2
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -subj '/O=example Inc./CN=example.com' -keyout example_certs2/example.com.key -out example_certs2/example.com.crt
openssl req -out example_certs2/httpbin.example.com.csr -newkey rsa:2048 -nodes -keyout example_certs2/httpbin.example.com.key -subj "/CN=httpbin.example.com/O=httpbin organization"
openssl x509 -req -sha256 -days 365 -CA example_certs2/example.com.crt -CAkey example_certs2/example.com.key -set_serial 0 -in example_certs2/httpbin.example.com.csr -out example_certs2/httpbin.example.com.crt


#为 helloworld.example.com 生成证书和私钥
openssl req -out example_certs1/helloworld.example.com.csr -newkey rsa:2048 -nodes -keyout example_certs1/helloworld.example.com.key -subj "/CN=helloworld.example.com/O=helloworld organization"
openssl x509 -req -sha256 -days 365 -CA example_certs1/example.com.crt -CAkey example_certs1/example.com.key -set_serial 1 -in example_certs1/helloworld.example.com.csr -out example_certs1/helloworld.example.com.crt
#生成客户端证书和私钥
openssl req -out example_certs1/client.example.com.csr -newkey rsa:2048 -nodes -keyout example_certs1/client.example.com.key -subj "/CN=client.example.com/O=client organization"
openssl x509 -req -sha256 -days 365 -CA example_certs1/example.com.crt -CAkey example_certs1/example.com.key -set_serial 1 -in example_certs1/client.example.com.csr -out example_certs1/client.example.com.crt
~~~
#### 配置单机TLS入口网关
1.为 Ingress Gateway 创建 Secret
~~~shell
kubectl create -n istio-system secret tls httpbin-credential \
  --key=example_certs1/httpbin.example.com.key \
  --cert=example_certs1/httpbin.example.com.crt
~~~
2.配置入口网关
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: mygateway
spec:
  selector:
    istio: ingressgateway # use istio default ingress gateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: httpbin-credential # 必须和上一步创建的secret同名
    hosts:
    - httpbin.example.com # 和上一步secret的域名一致
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - "httpbin.example.com"
  gateways:
    - mygateway
  http:
    - match:
        - uri:
            prefix: /status
        - uri:
            prefix: /delay
      route:
        - destination:
            port:
              number: 8000
            host: httpbin
~~~
3.测试
~~~shell
curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
  --cacert example_certs1/example.com.crt "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"
~~~
4.删除第一个证书，使用第二个
~~~shell
kubectl -n istio-system delete secret httpbin-credential
kubectl create -n istio-system secret tls httpbin-credential \
  --key=example_certs2/httpbin.example.com.key \
  --cert=example_certs2/httpbin.example.com.crt
~~~
5.使用旧的证书链和curl来访问httpbin服务会失败，需要使用新的
~~~shell
curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
  --cacert example_certs2/example.com.crt "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"
~~~
#### 为多个主机配置TLS入口网关
1.启动 helloworld-v1 示例，创建 helloworld-credential Secret
~~~shell
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/helloworld/helloworld.yaml -l service=helloworld
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/helloworld/helloworld.yaml -l version=v1
kubectl create -n istio-system secret tls helloworld-credential --key=helloworld-v1.example.com.key --cert=helloworld-v1.example.com.crt
~~~
2.使用 httpbin.example.com 和 helloworld.example.com 主机配置入口网关
~~~yaml
#为 443 端口定义一个具有两个服务器部分的网关。将每个端口上的 credentialName 值分别设置为 httpbin-credential 
#和 helloworld-credential。将 TLS 模式设置为 SIMPLE。
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: mygateway
spec:
  selector:
    istio: ingressgateway # use istio default ingress gateway
  servers:
    - port:
        number: 443
        name: https-httpbin
        protocol: HTTPS
      tls:
        mode: SIMPLE
        credentialName: httpbin-credential
      hosts:
        - httpbin.example.com
    - port:
        number: 443
        name: https-helloworld
        protocol: HTTPS
      tls:
        mode: SIMPLE
        credentialName: helloworld-credential
      hosts:
        - helloworld.example.com
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: helloworld
spec:
  hosts:
    - helloworld.example.com
  gateways:
    - mygateway
  http:
    - match:
        - uri:
            exact: /hello
      route:
        - destination:
            host: helloworld
            port:
              number: 5000
~~~
3.测试
~~~shell
curl -v -HHost:helloworld.example.com --resolve "helloworld.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
  --cacert example_certs1/example.com.crt "https://helloworld.example.com:$SECURE_INGRESS_PORT/hello"
  
curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
  --cacert example_certs1/example.com.crt "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"
~~~
#### 配置双向TLS入口网关
1.通过删除其Secret并创建一个新的来更改入口网关的凭据。服务器使用CA证书来验证其客户端
~~~shell
kubectl -n istio-system delete secret httpbin-credential
kubectl create -n istio-system secret generic httpbin-credential \
  --from-file=tls.key=example_certs1/httpbin.example.com.key \
  --from-file=tls.crt=example_certs1/httpbin.example.com.crt \
  --from-file=ca.crt=example_certs1/example.com.crt
~~~
2.更改网关的定义以将 TLS 模式设置为 MUTUAL
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: mygateway
spec:
  selector:
    istio: ingressgateway # use istio default ingress gateway
  servers:
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: MUTUAL
      credentialName: httpbin-credential # must be the same as secret
    hosts:
    - httpbin.example.com
~~~
3.尝试使用之前的方法发送 HTTPS 请求，失败
~~~shell
curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
--cacert example_certs1/example.com.crt "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"
~~~
4.将客户端证书和私钥传递给 curl 并重新发送请求。将带有 --cert 标志的客户证书和带有 --key 标志的私钥传递给 curl
~~~shell
curl -v -HHost:httpbin.example.com --resolve "httpbin.example.com:$SECURE_INGRESS_PORT:$INGRESS_HOST" \
  --cacert example_certs1/example.com.crt \
  --cert example_certs1/client.example.com.crt \
  --key example_certs1/client.example.com.key \
  "https://httpbin.example.com:$SECURE_INGRESS_PORT/status/418"
~~~
#### Kubernetes Ingress
描述如何使用Kubernetes Ingress为Istio配置入口网关以暴露服务网格集群内的服务
~~~yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    #需要使用 kubernetes.io/ingress.class 注解来告知 Istio 网关控制器它应该处理此 Ingress，否则它将被忽略
    kubernetes.io/ingress.class: istio
  name: ingress
spec:
  rules:
  - host: httpbin.example.com
    http:
      paths:
      - path: /status
        pathType: Prefix
        backend:
          service:
            name: httpbin
            port:
              number: 8000
~~~
#### Kubernetes Gateway API
描述 Istio 和 Kubernetes API 之间的差异，并提供了一个简单的例子，演示如何配置 Istio 
以使用Gateway API在服务网格集群外部暴露服务。
> Gateway API暂时还不稳定，处于快速迭代中
~~~shell
# 在大多数 Kubernetes 集群中，默认情况下不会安装 Gateway API，需要安装
kubectl get crd gateways.gateway.networking.k8s.io &> /dev/null || \
  { kubectl kustomize "github.com/kubernetes-sigs/gateway-api/config/crd?ref=v0.6.2" | kubectl apply -f -; }
~~~
1.区别
- Istio API 中的 Gateway 仅配置已部署的现有网关 Deployment/Service， 而在 Gateway API 
  中的 Gateway 资源不仅配置也会部署网关。 有关更多信息，请参阅具体部署方法 。
- 在 Istio VirtualService 中，所有协议都在单一的资源中配置， 而在 Gateway API 中，每种协议
  类型都有自己的资源，例如 HTTPRoute 和 TCPRoute。
- 虽然 Gateway API 提供了大量丰富的路由功能，但它还没有涵盖 Istio 的全部特性。 因此，正在进行
  的工作是扩展 API 以覆盖这些用例，以及利用 API 的可拓展性 来更好地暴露 Istio 的功能
2.使用（待完善）
## Egress
控制Istio服务网格的出口流量。
### 访问外部服务
访问外部服务的三种方法：
- 允许 Envoy 代理将请求传递到未在网格内配置过的服务。
- 配置 service entry 以提供对外部服务的受控访问。
- 对于特定范围的 IP，完全绕过 Envoy 代理
#### 开始
~~~shell
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/sleep/sleep.yaml
export SOURCE_POD=$(kubectl get pod -l app=sleep -o jsonpath={.items..metadata.name})
~~~
#### Envoy 转发流量到外部服务
Istio 有一个安装选项， global.outboundTrafficPolicy.mode，它配置 Sidecar 对外部服务（那些没有在
Istio 的内部服务注册中定义的服务）的处理方式。如果这个选项设置为 ALLOW_ANY， Istio 代理允许调用未知的
服务。如果这个选项设置为 REGISTRY_ONLY，那么 Istio 代理会阻止任何没有在网格中定义的 HTTP 服务或 
service entry 的主机。ALLOW_ANY 是默认值，不控制对外部服务的访问。
~~~shell
kubectl exec "$SOURCE_POD" -c sleep -- curl -sSI https://www.google.com | grep  "HTTP/"; 
kubectl exec "$SOURCE_POD" -c sleep -- curl -sI https://edition.cnn.com | grep "HTTP/"
~~~
这种访问外部服务的简单方法有一个缺点，即丢失了对外部服务流量的 Istio 监控和控制； 比如，外部服务的调用
没有记录到 Mixer 的日志中。
#### 控制对外部服务的访问
##### 更改为默认的封锁策略
执行以下命令来将 global.outboundTrafficPolicy.mode 选项改为 REGISTRY_ONLY
~~~yaml
spec:
  meshConfig:
    outboundTrafficPolicy:
      mode: REGISTRY_ONLY
~~~
##### 访问一个外部的 HTTP 服务
1.创建一个 ServiceEntry，以允许访问一个外部的 HTTP 服务
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: httpbin-ext
spec:
  hosts:
  - httpbin.org
  ports:
  - number: 80
    name: http
    protocol: HTTP
  resolution: DNS
  location: MESH_EXTERNAL
~~~
2.访问外部HTTP服务
~~~shell
kubectl exec -it $SOURCE_POD -c sleep -- curl http://httpbin.org/headers
#{
#  "headers": {
#  "Accept": "*/*",
#  "Connection": "close",
#  "Host": "httpbin.org",
#  ...
#  "X-Envoy-Decorator-Operation": "httpbin.org:80/*",
#  }
#}
# 注意由 Istio sidecar 代理添加的 headers: X-Envoy-Decorator-Operation
~~~
##### 访问外部 HTTPS 服务
1.创建一个 ServiceEntry，允许对外部服务的访问
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: google
spec:
  hosts:
  - www.google.com
  ports:
  - number: 443
    name: https
    protocol: HTTPS
  resolution: DNS
  location: MESH_EXTERNAL
~~~
2.访问外部HTTPS服务
~~~shell
kubectl exec -it $SOURCE_POD -c sleep -- curl -I https://www.google.com | grep  "HTTP/"
#HTTP/2 200
~~~
##### 管理到外部服务的流量
与集群内的请求相似，也可以为使用 ServiceEntry 配置访问的外部服务设置 Istio 路由规则。
1.设置调用外部服务 httpbin.org 的超时时间为 3 秒
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin-ext
spec:
  hosts:
    - httpbin.org
  http:
  - timeout: 3s #设置超时3s
    route:
      - destination:
          host: httpbin.org
        weight: 100
~~~
2.访问
~~~shell
kubectl exec "$SOURCE_POD" -c sleep -- time curl -o /dev/null -s -w "%{http_code}\n" http://httpbin.org/delay/5
~~~
##### 直接访问外部服务
让特定范围的IP完全绕过Istio，可以配置Envoy Sidecars以防止它们拦截外部请求，要设置绕过 
Istio，更改global.proxy.includeIPRanges或global.proxy.excludeIPRanges配置参数
- 排除所有外部 IP 重定向到 Sidecar 代理的一种简单方法是将 global.proxy.includeIPRanges 
配置选项设置为内部集群服务使用的 IP 范围
### 出口网关
如何配置Istio以通过专用的 egress gateway 服务间接调用外部服务
#### 使用场景
1.服务网格所有的出站流量必须经过一组专用节点， 这些专用节点用于实施 egress 流量的策略。
2.集群中的应用节点没有公有IP，节点上运行的网格Service无法访问互联网。通过定义 egress gateway，
将公有IP分配给egress gateway节点，用它引导所有的出站流量，可以使应用节点以受控方式访问外部服务
##### 部署 Istio egress gateway
~~~shell
kubectl get pod -l istio=egressgateway -n istio-ingress
~~~
使用 IstioOperator CR 安装 Istio，请在配置中添加以下字段
~~~yaml
spec:
  components:
    egressGateways:
      - name: istio-egressgateway
        enabled: true
~~~
istioctl
~~~shell
istioctl install <flags-you-used-to-install-Istio> \
                   --set components.egressGateways[0].name=istio-egressgateway \
                   --set components.egressGateways[0].enabled=true
~~~
##### 定义 Egress gateway 并引导 HTTP 流量
1.为 edition.cnn.com 定义一个 ServiceEntry
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: cnn
spec:
  hosts:
  - edition.cnn.com
  ports:
  - number: 80
    name: http-port
    protocol: HTTP
  - number: 443
    name: https
    protocol: HTTPS
  resolution: DNS
~~~
2.为 edition.cnn.com 端口 80 创建 egress Gateway。并为指向 egress gateway 的流量创建一个 destination rule。
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - edition.cnn.com
---
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: egressgateway-for-cnn
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
  - name: cnn
~~~
3.定义一个 VirtualService，将流量从 Sidecar 引导至 Egress Gateway， 再从 Egress Gateway 引导至外部服务
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: direct-cnn-through-egress-gateway
spec:
  hosts:
  - edition.cnn.com
  gateways:
  - istio-egressgateway
  - mesh
  http:
  - match:
    - gateways:
      - mesh
      port: 80
    route:
    - destination:
        host: istio-egressgateway.istio-system.svc.cluster.local
        subset: cnn
        port:
          number: 80
      weight: 100
  - match:
    - gateways:
      - istio-egressgateway
      port: 80
    route:
    - destination:
        host: edition.cnn.com
        port:
          number: 80
      weight: 100
~~~
##### 用 Egress gateway 发起 HTTPS 请求
1.为 edition.cnn.com 定义 ServiceEntry
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: ServiceEntry
metadata:
  name: cnn
spec:
  hosts:
  - edition.cnn.com
  ports:
  - number: 443
    name: tls
    protocol: TLS
  resolution: DNS
~~~
2.发送 HTTPS 请求到 https://edition.cnn.com/politics， 验证ServiceEntry是否已正确生效
~~~shell
kubectl exec "$SOURCE_POD" -c sleep -- curl -sSL -o /dev/null -D - https://edition.cnn.com/politics
~~~
3.为 edition.cnn.com 创建一个 egress Gateway。还需要创建一个 destination rule 和一个 virtualservice，
用来引导流量通过Egress Gateway， 并通过Egress Gateway与外部服务通信
~~~yaml
# Gateway
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: istio-egressgateway
spec:
  selector:
    istio: egressgateway
  servers:
  - port:
      number: 443
      name: tls
      protocol: TLS
    hosts:
    - edition.cnn.com
    tls:
      mode: PASSTHROUGH
--- # DestinationRule
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: egressgateway-for-cnn
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
  - name: cnn
--- # VirtualService
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: direct-cnn-through-egress-gateway
spec:
  hosts:
  - edition.cnn.com
  gateways:
  - mesh
  - istio-egressgateway
  tls:
  - match:
    - gateways:
      - mesh
      port: 443
      sni_hosts:
      - edition.cnn.com
    route:
    - destination:
        host: istio-egressgateway.istio-system.svc.cluster.local
        subset: cnn
        port:
          number: 443
  - match:
    - gateways:
      - istio-egressgateway
      port: 443
      sni_hosts:
      - edition.cnn.com
    route:
    - destination:
        host: edition.cnn.com
        port:
          number: 443
      weight: 100
~~~
4.发送 HTTPS 请求到 https://edition.cnn.com/politics
~~~shell
kubectl exec "$SOURCE_POD" -c sleep -- curl -sSL -o /dev/null -D - https://edition.cnn.com/politics
~~~
##### 应用 Kubernetes 网络策略
如何创建 Kubernetes 网络策略 来阻止绕过 egress gateway 的出站流量.
1.创建 test-egress 命名空间
~~~shell
kubectl create namespace test-egress
~~~
2.在 test-egress 命名空间中部署 sleep 示例应用
~~~shell
kubectl apply -n test-egress -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/sleep/sleep.yaml
~~~
3.检查生成的 Pod，其中应该只有一个容器，也就是说没有注入IstioSidecar
~~~shell
kubectl get pod $(kubectl get pod -n test-egress -l app=sleep -o jsonpath={.items..metadata.name}) -n test-egress
~~~
4.从 test-egress 命名空间的 sleep Pod 中向 https://edition.cnn.com/politics 发送 HTTPS 请求。因为没有任何限制，所以这一请求应该会成功
~~~shell
kubectl exec -it $(kubectl get pod -n test-egress -l app=sleep -o jsonpath={.items..metadata.name}) -n test-egress -c sleep -- curl -s -o /dev/null -w "%{http_code}\n"  https://edition.cnn.com/politics
#200
~~~
5.给 Istio 组件（控制平面和 gateway）所在的命名空间打上标签
~~~shell
kubectl label namespace istio-system istio=system
~~~
6.给 kube-system 命名空间打标签
~~~shell
kubectl label ns kube-system kube-system=true
~~~
7.创建一个 NetworkPolicy，来限制 test-egress 命名空间的出站流量， 只允许目标为 kube-system DNS（端口 53）的请求，以及目标为 istio-system 命名空间的所有请求
~~~yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-egress-to-istio-system-and-kube-dns
spec:
  podSelector: {}
  policyTypes:
  - Egress
  egress:
  - to:
    - namespaceSelector:
        matchLabels:
          kube-system: "true"
    ports:
    - protocol: UDP
      port: 53
  - to:
    - namespaceSelector:
        matchLabels:
          istio: system
~~~
>网络策略由Kubernetes集群中的网络插件实现。以下情况可能不会阻止下面的步骤

8.重新发送前面的 HTTPS 请求到 https://edition.cnn.com/politics，这次请求就不会成功了，这是因为流量被网络策略拦截了
~~~shell
kubectl exec -it $(kubectl get pod -n test-egress -l app=sleep -o jsonpath={.items..metadata.name}) -n test-egress -c sleep -- curl -v https://edition.cnn.com/politics
#Hostname was NOT found in DNS cache
#  Trying 151.101.65.67...
#  Trying 2a04:4e42:200::323...
~~~
9.接下来在 test-egress 命名空间的 sleep Pod 上注入 Sidecar，启用 test-egress 命名空间的自动注入
~~~shell
kubectl label namespace test-egress istio-injection=enabled
~~~
10.重新部署 sleep
~~~shell
kubectl delete deployment sleep -n test-egress
kubectl apply -f https://raw.githubusercontent.com/istio/istio/release-1.18/samples/sleep/sleep.yaml
~~~
11.检查生成的 Pod，其中应该有了两个容器，其中包含了注入的 sidecar（istio-proxy）
~~~shell
kubectl get pod $(kubectl get pod -n test-egress -l app=sleep -o jsonpath={.items..metadata.name}) -n test-egress -o jsonpath='{.spec.containers[*].name}'
~~~
12.在 default 命名空间中创建一个与 sleep pod 类似的目标规则，用来引导 test-egress 命名空间内的流量经过 egress 网关
~~~yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: egressgateway-for-cnn
spec:
  host: istio-egressgateway.istio-system.svc.cluster.local
  subsets:
  - name: cnn
~~~
13.向 https://edition.cnn.com/politics 发送 HTTP 请求，这次会成功，原因是网络策略允许流量流向 istio-system 
中的 istio-egressgateway。 istio-egressgateway 最终把流量转发到 edition.cnn.com
~~~shell
kubectl exec -it $(kubectl get pod -n test-egress -l app=sleep -o jsonpath={.items..metadata.name}) -n test-egress -c sleep -- curl -s -o /dev/null -w "%{http_code}\n" https://edition.cnn.com/politics
#200
~~~
