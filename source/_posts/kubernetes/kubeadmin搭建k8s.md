---
title: kubeadm搭建k8s集群
date: 2023-05-16 13:42:11 
tags: kubeadm kubernetes
---

### 环境准备

~~~
# 临时
systemctl stop firewalld
# 永久
systemctl disable firewalld
# 永久
sed -i 's/enforcing/disabled/' /etc/selinux/config 
# 临时
setenforce 0
# 临时
swapoff -a 
# 永久;把文件中带有swap的行注释
vim /etc/fstab 
# 添加主机名与IP对应关系
hostnamectl set-hostname <hostname>
192.168.0.143  hostnamectl set-hostname master
192.168.0.142  hostnamectl set-hostname node1
192.168.0.141  hostnamectl set-hostname node2
cat >> /etc/hosts << EOF
192.168.0.143	master	
192.168.0.142	node1	
192.168.0.141	node2	
EOF
#配置内核参数
cat > /etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
#配置时间同步
date 
yum install -y ntpdate
# 同步最新时间
ntpdate time.windows.com 
~~~

### 安裝步骤

1.在所有节点上安装Docker和kubeadm

~~~
sudo yum update -y
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io
systemctl enable docker && systemctl start docker
vim /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "registry-mirrors":["https://08jm2d89.mirror.aliyuncs.com","https://registry.docker-cn.com"]
}
systemctl daemon-reload
systemctl restart docker

#containerd
### 生成配置文件
containerd config default > /etc/containerd/config.toml
### 修改配置文件
sed -i 's#SystemdCgroup = false#SystemdCgroup = true#g' /etc/containerd/config.toml
sed -i 's#sandbox_image = "registry.k8s.io/pause:3.6"#sandbox_image="registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.6"#g' /etc/containerd/config.toml
### 配置镜像加速
sed -i 's#config_path = ""#config_path = "/etc/containerd/certs.d"#g' /etc/containerd/config.toml
mkdir -p /etc/containerd/certs.d/docker.io
cat > /etc/containerd/certs.d/docker.io/hosts.toml << EOF
server = "https://registry-1.docker.io"
[host."https://08jm2d89.mirror.aliyuncs.com]
  capabilities = ["pull", "resolve", "push"]
EOF
## 启动生效
systemctl daemon-reload ; systemctl enable containerd --now

vi /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
 http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
 
#指定版本否则都会默认安装库中最新版本，会因为彼此依赖的版本不同安装失败
yum install -y kubelet-1.26.4 kubeadm-1.26.4 kubectl-1.26.4
#设置开机启动并启动kubelet
systemctl enable kubelet && systemctl start kubelet
#查看需要依赖的镜像版本
kubeadm config images list
registry.k8s.io/kube-apiserver:v1.26.4
registry.k8s.io/kube-controller-manager:v1.26.4
registry.k8s.io/kube-scheduler:v1.26.4
registry.k8s.io/kube-proxy:v1.26.4
registry.k8s.io/pause:3.9
registry.k8s.io/etcd:3.5.6-0
registry.k8s.io/coredns/coredns:v1.9.3

sudo kubeadm config print init-defaults > init-default.yaml
sudo kubeadm config print join-defaults > join-default.yaml
~~~

拉取镜像脚本kubeadm-config-download.sh

~~~
#!/bin/bash
images=(
    kube-apiserver:v1.26.4
    kube-controller-manager:v1.26.4
    kube-scheduler:v1.26.4
    kkube-proxy:v1.26.4
    pause:3.9
    pause:3.6
    etcd:3.5.6-0
    coredns:v1.9.3
)
for imageName in ${images[@]} ; do
    docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/${imageName}
    docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/${imageName} registry.k8s.io/${imageName}
done
~~~

2.部署Kubernetes Master

~~~
#kubeadm init --apiserver-advertise-address 192.168.0.143 --image-repository registry.cn-hangzhou.aliyuncs.com/google_containers --kubernetes-version v1.26.4 --service-cidr=10.10.0.0/16 --pod-network-cidr=10.20.0.0/16
#修改init-default.yaml配置
kubeadm init --config init-default.yaml

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 192.168.0.143:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:e3d70eb9918d1d3fd41dc636859c15f5f2aed6694a0b92615dba908b9fc0ab80
~~~

- 重置方法

~~~
# 重置master
kubeadm reset
kubeadm reset -f

# 重置过程不会清除CNI 配置,必须手动删除 /etc/cni/net.d
rm -rf /etc/cni/net.d

# 清理lvs策略
ipvsadm --clear
~~~

4.部署Kubernetes Node，将节点加入Kubernetes集群中
~~~
#重复步骤1
#使用步骤二得到的token join
kubeadm join 192.168.0.143:6443 --token abcdef.0123456789abcdef --discovery-token-ca-cert-hash sha256:e3d70eb9918d1d3fd41dc636859c15f5f2aed6694a0b92615dba908b9fc0ab80
#默认token有效期24小时,当过期之后,需要重建token
kubeadm token create --print-join-command
~~~
> https://kubernetes.io/zh-cn/docs/reference/setup-tools/kubeadm/kubeadm-token/

3.部署容器网络插件
~~~
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kubeflannel.yml
vim kube-flannel.yml
#根据具体情况修改，这里networking 修改为192.168.0.0/16
kubectl apply -f kube-flannel.yml
kubectl get pods -A -owide
~~~
Master 节点默认是不允许部署非系统的 pod，我们可以通过删除污点的方式运行部署
~~~
#查看污点
kubectl describe node | grep Taints
#删除污点
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
~~~

