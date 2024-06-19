---
title: kubernetes安装dashboard
date: 2023-05-17 15:07:11
updated: 2023-06-20 10:08:15
categories: kubernetes
tags:
- kubernetes
- dashboard
---
### 安装dashboard
根据recommended.yaml安装
~~~shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.7.0/aio/deploy/recommended.yaml
~~~
#### 使用kube-proxy
~~~shell
kubectl apply -f admin-user.yaml
kubectl apply -f admin-user-role-binding.yaml
kubectl -n kubernetes-dashboard create token admin-user
kubectl proxy
#访问以下地址即可
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/.
~~~
#### 使用NodePort暴露服务
1.修改为NodePort
~~~shell
kubectl get pods --namespace=kubernetes-dashboard -o wide
kubectl --namespace=kubernetes-dashboard get service kubernetes-dashboard
kubectl --namespace=kubernetes-dashboard edit service kubernetes-dashboard
#type: ClusterIP改为type: NodePort
kubectl --namespace=kubernetes-dashboard get service kubernetes-dashboard
~~~
2.生成证书
因为使用了service的NodePort暴露服务,dashboard本身又需要tls访问，所以此处生成自签名的CA证书
~~~shell
mkdir key && cd key
openssl genrsa -out dashboard.key 2048
openssl req -new -out dashboard.csr -key dashboard.key -subj '/CN=139.196.93.92'
openssl x509 -req -in dashboard.csr -signkey dashboard.key -out dashboard.crt
#删除原有的证书secret
kubectl delete secret kubernetes-dashboard-certs -n kubernetes-dashboard
#创建新的证书secret
kubectl create secret generic kubernetes-dashboard-certs --from-file=dashboard.key --from-file=dashboard.crt -n kubernetes-dashboard
kubectl get pod -n kubernetes-dashboard
kubectl delete pod kubernetes-dashboard-6ff574dd47-gfzq6  -n kubernetes-dashboard
~~~
3.获取token,参考官方AccessControl配置用户,然后生成token
> https://github.com/kubernetes/dashboard/blob/master/docs/user/access-control/creating-sample-user.md

admin-user.yaml
~~~yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
~~~
admin-user-role-binding.yaml
~~~yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
~~~
或者放在一起使用 dashboard-admin-user.yaml
~~~yaml
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard
~~~
~~~shell
kubectl apply -f admin-user.yaml
kubectl apply -f admin-user-role-binding.yaml
#获取token
kubectl -n kubernetes-dashboard create token admin-user
~~~
~~~shell
#Remove the admin ServiceAccount and ClusterRoleBinding.
kubectl -n kubernetes-dashboard delete serviceaccount admin-user
kubectl -n kubernetes-dashboard delete clusterrolebinding admin-user
~~~
> 官方地址 https://github.com/kubernetes/dashboard
