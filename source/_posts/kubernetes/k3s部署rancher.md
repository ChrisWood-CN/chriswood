---
title: k3s部署rancher
categories: rancher
tags:
  - rancher
  - k3s
date: 2023-06-15 08:50:21
---

## 简易版
rancher版本2.7.4
#### 部署k3s server节点
如果是windows环境，推荐使用k3d在docker中安装k3s
~~~shell
k3d cluster create --config local-k3s.yaml
~~~
~~~yaml
# k3d configuration file, saved as e.g. /home/me/myk3dcluster.yaml
apiVersion: k3d.io/v1alpha5 # this will change in the future as we make everything more stable
kind: Simple # internally, we also have a Cluster config, which is not yet available externally
metadata:
  name: local-k3s # name that you want to give to your cluster (will still be prefixed with `k3d-`)
servers: 1 # same as `--servers 1`
agents: 2 # same as `--agents 2`
kubeAPI: # same as `--api-port myhost.my.domain:6445` (where the name would resolve to 127.0.0.1)
  #host: "myhost.my.domain" # important for the `server` setting in the kubeconfig
  hostIP: "127.0.0.1" # where the Kubernetes API will be listening on
  hostPort: "6443" # where the Kubernetes API listening port will be mapped to on your host system
image: rancher/k3s:v1.21.14-k3s1 # same as `--image rancher/k3s:v1.20.4-k3s1`
network: k3s-net # same as `--network my-custom-net`
ports:
  - port: 8080:80 # same as `--port '8080:80@loadbalancer'`
    nodeFilters:
      - loadbalancer
  - port: 8443:443 # same as `--port '8080:80@loadbalancer'`
    nodeFilters:
      - loadbalancer
options:
  k3d: # k3d runtime settings
    wait: true # wait for cluster to be usable before returining; same as `--wait` (default: true)
    timeout: "60s" # wait timeout before aborting; same as `--timeout 60s`
    disableLoadbalancer: false # same as `--no-lb`
    disableImageVolume: false # same as `--no-image-volume`
    disableRollback: false # same as `--no-Rollback`
    loadbalancer:
      configOverrides:
        - settings.workerConnections=2048
  k3s: # options passed on to K3s itself
    extraArgs: # additional arguments passed to the `k3s server|agent` command; same as `--k3s-arg`
      - arg: --disable=traefik  #server disable traefik
        nodeFilters:
          - server:*
    nodeLabels:
      - label: role=server # same as `--k3s-node-label 'role=server@agent:*'` -> this results in a Kubernetes node label
        nodeFilters:
          - server:*
      - label: type=master
        nodeFilters:
          - server:0
      - label: role=agent # same as `--k3s-node-label 'role=agent@agent:*'` -> this results in a Kubernetes node label
        nodeFilters:
          - agent:*
      - label: type=master
        nodeFilters:
          - agent:0
  kubeconfig:
    updateDefaultKubeconfig: true # add new cluster to your default Kubeconfig; same as `--kubeconfig-update-default` (default: true)
    switchCurrentContext: true # also set current-context to the new cluster's context; same as `--kubeconfig-switch-context` (default: true)
# k3d cluster create --api-port 6443 -p "9080:80@loadbalancer"  -p "9443:443@loadbalancer" --agents 2 --k3s-arg '--disable=traefik@server:*'
~~~
linux环境直接使用官网方式
~~~shell
systemctl stop firewalld
systemctl disable firewalld
setenforce 0
sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config

curl -sfL https://rancher-mirror.rancher.cn/k3s/k3s-install.sh | INSTALL_K3S_MIRROR=cn INSTALL_K3S_VERSION=v1.21.14+k3s1 sh -
~~~
#### 卸载k3s
~~~shell
# 停止k3s
/usr/local/bin/k3s-killall.sh
# 重启k3s
systemctl restart k3s
# 卸载k3s
/usr/local/bin/k3s-uninstall.sh
~~~
#### 安装helm
> https://helm.sh/docs/intro/install/
> https://github.com/helm/helm/releases
~~~shell
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
curl -L -o helm-v3.12.0-linux-amd64.tar.gz https://get.helm.sh/helm-v3.12.0-linux-amd64.tar.gz
tar -zxvf helm-v3.12.0-linux-amd64.tar.gz
mv linux-amd64/helm /usr/local/bin/helm
~~~
#### 安装cert-manager
~~~shell
helm repo add jetstack https://charts.jetstack.io
helm repo update
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.11.0/cert-manager.crds.yaml

helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.11.0
#helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version v1.11.0
~~~
#### 安装rancher
~~~shell
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
helm repo update

helm install rancher rancher-latest/rancher \
  --namespace cattle-system \
  --create-namespace \
  --set hostname=<IP_OF_LINUX_NODE>.sslip.io \
  --set replicas=1 \
  --set bootstrapPassword=<PASSWORD_FOR_RANCHER_ADMIN>
#helm install rancher rancher-stable/rancher --version 2.7.4 --namespace cattle-system --create-namespace --set hostname=rancher.taotaozn.com --set replicas=1
~~~
#### 卸载rancher
~~~shell
helm uninstall rancher -n cattle-system
helm uninstall fleet-agent-local -n cattle-fleet-local-system
helm uninstall fleet-crd -n cattle-fleet-system
~~~
## helm常用charts仓库
~~~shell
#bitnami: 
https://charts.bitnami.com/bitnami
#kubeapps: 
https://charts.appscode.com/stable/
#阿里云镜像
https://kubernetes.oss-cn-hangzhou.aliyuncs.com/charts
#微软镜像
http://mirror.azure.cn/kubernetes/charts
~~~
