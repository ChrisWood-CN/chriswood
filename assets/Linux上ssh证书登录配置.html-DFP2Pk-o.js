import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as i,o as e,b as a}from"./app-Di2jApqi.js";const n={},t=a(`<h2 id="centos7-配置-ssh-证书登录" tabindex="-1"><a class="header-anchor" href="#centos7-配置-ssh-证书登录"><span>centos7 配置 ssh 证书登录</span></a></h2><p>1.在/root/.ssh 目录下创建 rsa 密钥对，生成的 id_rsa（私钥）下载到本地，证书登录时需要用，id_rsa.pub（公钥）</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">mkdir</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ~/.ssh</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 0700</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> .ssh</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#56B6C2;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ~/.ssh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">ssh-keygen</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -t</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> rsa</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> -b</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 4096</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><blockquote><p>生成的文件为默认文件名（id_rsa），如想要命名成自己想要的，可在以上命令后面加上 -f 你的文件名</p></blockquote><p>2.生成的公钥内容复制到 authorized_keys 文件中，再设置 authorized_keys 文件权限为 600 或 644</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">cp</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> id_rsa.pub</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> authorized_keys</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">chmod</span><span style="--shiki-light:#005CC5;--shiki-dark:#D19A66;"> 0600</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> authorized_keys</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>3.修改配置文件，/etc/ssh/sshd_config</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">vim</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> /etc/ssh/sshd_config</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="shiki" data-ext="text" data-title="text" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>PermitRootLogin yes</span></span>
<span class="line"><span>//是否允许root账号登录，yes=允许，no=不允许，without-password=不允许通过密码ssh登陆，forced-commands-only=可以登录，但是登陆后不能进入交互，而是执行指定的命令后 自动退出</span></span>
<span class="line"><span>PasswordAuthentication no</span></span>
<span class="line"><span>//如果要禁用密码登录需要把PasswordAuthentication设置为no,未验证完证书是否能正常登录时，请不要设置成no</span></span>
<span class="line"><span>StrictModes no</span></span>
<span class="line"><span>//是否严格模式</span></span>
<span class="line"><span>RSAAuthentication yes</span></span>
<span class="line"><span>//启用 RSA 认证，默认为yes</span></span>
<span class="line"><span>PubkeyAuthentication yes</span></span>
<span class="line"><span>//启用公钥认证，默认为yes</span></span>
<span class="line"><span>AuthorizedKeysFile ~/.ssh/authorized_keys</span></span>
<span class="line"><span>//指定公钥所存放的位置，如果是想要有多个密钥对，可以参考下面写法，切不可在同一个文件里面放多个公钥，到时有麻烦事</span></span>
<span class="line"><span>//AuthorizedKeysFile ~/.ssh/authorized_keys1 ~/.ssh/authorized_keys2 ~/.ssh/authorized_keys3</span></span>
<span class="line"><span>//多个密钥对写法，这些文件中放的都是公钥内容，扩展名为.pub的文件，另外要注意，这些文件在你修改当前配置文件之前，最好将authorized_keys1这些公钥文件提前设置好</span></span>
<span class="line"><span># AuthorizedKeysFile      .ssh/authorized_keys</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>4.重启服务，使更改生效</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> sshd</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h2 id="ubuntu20-04-配置-ssh-证书登录" tabindex="-1"><a class="header-anchor" href="#ubuntu20-04-配置-ssh-证书登录"><span>ubuntu20.04 配置 ssh 证书登录</span></a></h2><p>1.安装 ssh 服务</p><div class="language-shell line-numbers-mode" data-highlighter="shiki" data-ext="shell" data-title="shell" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> apt-update</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> apt</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> openssh-server</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> systemctl</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> status</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ssh</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#61AFEF;">sudo</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ufw</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> allow</span><span style="--shiki-light:#032F62;--shiki-dark:#98C379;"> ssh</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2.剩余步骤参考 <a href="#centos7%E9%85%8D%E7%BD%AEssh%E8%AF%81%E4%B9%A6%E7%99%BB%E5%BD%95">centos7 配置 ssh 证书登录</a></p><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考</span></a></h2><ol><li><a href="https://blog.csdn.net/zhangweixbl4/article/details/135106258" target="_blank" rel="noopener noreferrer">https://blog.csdn.net/zhangweixbl4/article/details/135106258</a></li><li><a href="https://www.jianshu.com/p/6e8d70c4d820" target="_blank" rel="noopener noreferrer">https://www.jianshu.com/p/6e8d70c4d820</a></li></ol>`,18),l=[t];function h(d,r){return e(),i("div",null,l)}const c=s(n,[["render",h],["__file","Linux上ssh证书登录配置.html.vue"]]),o=JSON.parse('{"path":"/zh/posts/linux/Linux%E4%B8%8Assh%E8%AF%81%E4%B9%A6%E7%99%BB%E5%BD%95%E9%85%8D%E7%BD%AE.html","title":"Linux上ssh证书登录配置","lang":"zh-CN","frontmatter":{"title":"Linux上ssh证书登录配置","date":"2023-08-17T07:55:08.000Z","updated":"2024-06-20T09:17:20.000Z","categories":"Linux","tags":["ssh","Linux"],"description":"centos7 配置 ssh 证书登录 1.在/root/.ssh 目录下创建 rsa 密钥对，生成的 id_rsa（私钥）下载到本地，证书登录时需要用，id_rsa.pub（公钥） 生成的文件为默认文件名（id_rsa），如想要命名成自己想要的，可在以上命令后面加上 -f 你的文件名 2.生成的公钥内容复制到 authorized_keys 文件中，...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/zh/posts/linux/Linux%E4%B8%8Assh%E8%AF%81%E4%B9%A6%E7%99%BB%E5%BD%95%E9%85%8D%E7%BD%AE.html"}],["meta",{"property":"og:site_name","content":"博客"}],["meta",{"property":"og:title","content":"Linux上ssh证书登录配置"}],["meta",{"property":"og:description","content":"centos7 配置 ssh 证书登录 1.在/root/.ssh 目录下创建 rsa 密钥对，生成的 id_rsa（私钥）下载到本地，证书登录时需要用，id_rsa.pub（公钥） 生成的文件为默认文件名（id_rsa），如想要命名成自己想要的，可在以上命令后面加上 -f 你的文件名 2.生成的公钥内容复制到 authorized_keys 文件中，..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-20T01:49:25.000Z"}],["meta",{"property":"article:author","content":"chriswoodcn"}],["meta",{"property":"article:tag","content":"ssh"}],["meta",{"property":"article:tag","content":"Linux"}],["meta",{"property":"article:published_time","content":"2023-08-17T07:55:08.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-20T01:49:25.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Linux上ssh证书登录配置\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-08-17T07:55:08.000Z\\",\\"dateModified\\":\\"2024-06-20T01:49:25.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"chriswoodcn\\"}]}"]]},"headers":[{"level":2,"title":"centos7 配置 ssh 证书登录","slug":"centos7-配置-ssh-证书登录","link":"#centos7-配置-ssh-证书登录","children":[]},{"level":2,"title":"ubuntu20.04 配置 ssh 证书登录","slug":"ubuntu20-04-配置-ssh-证书登录","link":"#ubuntu20-04-配置-ssh-证书登录","children":[]},{"level":2,"title":"参考","slug":"参考","link":"#参考","children":[]}],"git":{"createdTime":1718787514000,"updatedTime":1718848165000,"contributors":[{"name":"chriswoodcn","email":"chriswoodcn@aliyun.com","commits":3}]},"readingTime":{"minutes":1.72,"words":515},"filePathRelative":"zh/posts/linux/Linux上ssh证书登录配置.md","localizedDate":"2023年8月17日","excerpt":"<h2>centos7 配置 ssh 证书登录</h2>\\n<p>1.在/root/.ssh 目录下创建 rsa 密钥对，生成的 id_rsa（私钥）下载到本地，证书登录时需要用，id_rsa.pub（公钥）</p>\\n<div class=\\"language-shell line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"shell\\" data-title=\\"shell\\" style=\\"--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34\\"><pre class=\\"shiki shiki-themes github-light one-dark-pro vp-code\\"><code><span class=\\"line\\"><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\">mkdir</span><span style=\\"--shiki-light:#005CC5;--shiki-dark:#D19A66\\"> -p</span><span style=\\"--shiki-light:#032F62;--shiki-dark:#98C379\\"> ~/.ssh</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#6F42C1;--shiki-dark:#61AFEF\\">chmod</span><span style=\\"--shiki-light:#005CC5;--shiki-dark:#D19A66\\"> 0700</span><span style=\\"--shiki-light:#032F62;--shiki-dark:#98C379\\"> .ssh</span></span>\\n<span class=\\"line\\"><span style=\\"--shiki-light:#005CC5;--shiki-dark:#56B6C2\\">cd</span><span style=\\"--shiki-light:#032F62;--shiki-dark:#98C379\\"> ~/.ssh</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{c as comp,o as data};
