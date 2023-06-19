---
title: istio配置
categories: kubenetes
tags:
- kubernetes
- istio
---
## Gateway
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
