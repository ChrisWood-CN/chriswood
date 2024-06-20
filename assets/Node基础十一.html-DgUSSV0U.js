import{_ as s}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as n,o as a,b as e}from"./app-DZw5DSeQ.js";const i={},l=e(`<h2 id="十一-koa开发web服务器" tabindex="-1"><a class="header-anchor" href="#十一-koa开发web服务器"><span>十一.koa开发web服务器</span></a></h2><h2 id="koa初体验" tabindex="-1"><a class="header-anchor" href="#koa初体验"><span>Koa初体验</span></a></h2><h3 id="_1-1-认识koa" tabindex="-1"><a class="header-anchor" href="#_1-1-认识koa"><span>1.1. 认识Koa</span></a></h3><p>前面我们已经学习了express，另外一个非常流行的Node Web服务器框架就是Koa。</p><p>Koa官方的介绍：</p><ul><li>koa：next generation web framework for node.js；</li><li>koa：node.js的下一代web框架；</li></ul><p>事实上，koa是express同一个团队开发的一个新的Web框架：</p><ul><li>目前团队的核心开发者TJ的主要精力也在维护Koa，express已经交给团队维护了；</li><li>Koa旨在为Web应用程序和API提供更小、更丰富和更强大的能力；</li><li>相对于express具有更强的异步处理能力（后续我们再对比）；</li><li>Koa的核心代码只有1600+行，是一个更加轻量级的框架，我们可以根据需要安装和使用中间件；</li></ul><h3 id="_1-2-koa初体验" tabindex="-1"><a class="header-anchor" href="#_1-2-koa初体验"><span>1.2. koa初体验</span></a></h3><p>因为学习过了express，它们的基本开发模式是比较相似的。</p><p>我们来体验一下koa的Web服务器：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const Koa = require(&#39;koa&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const app = new Koa();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;middleware 01&quot;);</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;middleware 02&quot;);</span></span>
<span class="line"><span>  ctx.response.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.listen(8000, () =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;服务器启动成功~&quot;);</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>koa注册的中间件提供了两个参数：</p><ul><li><p>ctx：上下文（Context）对象；</p></li><li><ul><li>koa并没有像express一样，将req和res分开，而是将它们作为ctx的属性；</li></ul></li><li><p>ctx代表依次请求的上下文对象；</p></li><li><p><code>ctx.request</code>：获取请求对象；</p></li><li><p><code>ctx.response</code>：获取响应对象；</p></li><li><p>next：本质上是一个dispatch，类似于之前的next；</p></li><li><ul><li>后续我们学习Koa的源码，来看一下它是一个怎么样的函数；</li></ul></li></ul><p>koa通过创建的app对象，注册中间件只能通过use方法：</p><ul><li>Koa并没有提供methods的方式来注册中间件；</li><li>也没有提供path中间件来匹配路径；</li></ul><p>但是真实开发中我们如何将路径和method分离呢？</p><ul><li>方式一：根据request自己来判断；</li><li>方式二：使用第三方路由中间件；</li></ul><p>方式一：根据request自己判断</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  if (ctx.request.path === &#39;/users&#39;) {</span></span>
<span class="line"><span>    if (ctx.request.method === &#39;POST&#39;) {</span></span>
<span class="line"><span>      ctx.response.body = &quot;Create User Success~&quot;;</span></span>
<span class="line"><span>    } else {</span></span>
<span class="line"><span>      ctx.response.body = &quot;Users List~&quot;;</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  } else {</span></span>
<span class="line"><span>    ctx.response.body = &quot;Other Request Response&quot;;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>整个代码的逻辑是非常复杂和混乱的，真实开发中我们会使用路由。</p><h3 id="_1-3-路由的使用" tabindex="-1"><a class="header-anchor" href="#_1-3-路由的使用"><span>1.3. 路由的使用</span></a></h3><p>koa官方并没有给我们提供路由的库，我们可以选择第三方库：koa-router</p><h4 id="_1-3-1-安装koa-router" tabindex="-1"><a class="header-anchor" href="#_1-3-1-安装koa-router"><span>1.3.1. 安装koa-router</span></a></h4><p>因为是第三方的库，所以我们需要单独下项目中安装：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>npm install koa-router</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h4 id="_1-3-2-koa-router基本使用" tabindex="-1"><a class="header-anchor" href="#_1-3-2-koa-router基本使用"><span>1.3.2. koa-router基本使用</span></a></h4><p>我们可以先封装一个 <code>user.router.js</code> 的文件：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const Router = require(&#39;koa-router&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const userRouter = new Router();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>userRouter.get(&#39;/users&#39;, (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.response.body = &quot;user list~&quot;;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>userRouter.post(&#39;/users&#39;, (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.response.body = &quot;create user info~&quot;;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module.exports = userRouter;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在app中将<code>router.routes()</code>注册为中间件：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>app.use(userRouter.routes());</span></span>
<span class="line"><span>app.use(userRouter.allowedMethods());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>注意：<code>allowedMethods</code>用于判断<code>某一个method</code>是否支持：</p><ul><li>如果我们请求 get，那么是正常的请求，因为我们有实现get；</li><li>如果我们请求 put、delete、patch，那么就自动报错：<code>Method Not Allowed</code>，状态码：405；</li><li>如果我们请求 link、copy、lock，那么就自动报错：<code>Not Implemented</code>，状态码：501；</li></ul><h4 id="_1-3-3-router的前缀" tabindex="-1"><a class="header-anchor" href="#_1-3-3-router的前缀"><span>1.3.3. router的前缀</span></a></h4><p>通常一个路由对象是对一组相似路径的封装，那么路径的前缀都是一直的，所以我们可以直接在创建Router时，添加前缀：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const userRouter = new Router({prefix: &#39;/users&#39;});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>userRouter.get(&#39;/&#39;, (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.response.body = &quot;user list~&quot;;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>userRouter.post(&#39;/&#39;, (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.response.body = &quot;create user info~&quot;;</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>module.exports = userRouter;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-请求解析" tabindex="-1"><a class="header-anchor" href="#_1-4-请求解析"><span>1.4. 请求解析</span></a></h3><p>客户端传递到服务器参数的方法常见的是5种：</p><ul><li>方式一：通过get请求中的URL的params；</li><li>方式二：通过get请求中的URL的query；</li><li>方式三：通过post请求中的body的json格式；</li><li>方式四：通过post请求中的body的x-www-form-urlencoded格式；</li><li>方式五：通过post请求中的form-data格式；</li></ul><h4 id="_1-4-1-方式一-params" tabindex="-1"><a class="header-anchor" href="#_1-4-1-方式一-params"><span>1.4.1. 方式一：params</span></a></h4><p>请求地址：http://localhost:8000/users/123</p><p>获取params：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const userRouter = new Router({prefix: &quot;/users&quot;})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>userRouter.get(&quot;/:id&quot;, (ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(ctx.params.id);</span></span>
<span class="line"><span>  ctx.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-4-2-方式二-query" tabindex="-1"><a class="header-anchor" href="#_1-4-2-方式二-query"><span>1.4.2. 方式二：query</span></a></h4><p>请求地址：http://localhost:8000/login?username=why&amp;password=123</p><p>获取query：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(ctx.request.query);</span></span>
<span class="line"><span>  ctx.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-4-3-方式三-json" tabindex="-1"><a class="header-anchor" href="#_1-4-3-方式三-json"><span>1.4.3. 方式三：json</span></a></h4><p>请求地址：http://localhost:8000/login</p><p>body是json格式：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>{</span></span>
<span class="line"><span>    &quot;username&quot;: &quot;coderwhy&quot;,</span></span>
<span class="line"><span>    &quot;password&quot;: &quot;123&quot;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取json数据：</p><ul><li>安装依赖：<code>npm install koa-bodyparser</code>;</li><li>使用 <code>koa-bodyparser</code>的中间件；</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>app.use(bodyParser());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(ctx.request.body);</span></span>
<span class="line"><span>  ctx.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-4-4-方式四-x-www-form-urlencoded" tabindex="-1"><a class="header-anchor" href="#_1-4-4-方式四-x-www-form-urlencoded"><span>1.4.4. 方式四：x-www-form-urlencoded</span></a></h4><p>请求地址：http://localhost:8000/login</p><p>body是x-www-form-urlencoded格式：</p><p><img src="https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXusUoicD7NHXV5rLv2RQouhMqM41ZibicHx6BfUYLjkQic0jIVBjkwr5gib3vPBhIUBZlLicjUwruFLAfqnQ/640?wx_fmt=jpeg&amp;wxfrom=5&amp;wx_lazy=1&amp;wx_co=1" alt="图片" loading="lazy">x-www-form-urlencoded</p><p>获取json数据：(和json是一致的)</p><ul><li>安装依赖：<code>npm install koa-bodyparser</code>;</li><li>使用 <code>koa-bodyparser</code>的中间件；</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>app.use(bodyParser());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(ctx.request.body);</span></span>
<span class="line"><span>  ctx.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-4-5-方式五-form-data" tabindex="-1"><a class="header-anchor" href="#_1-4-5-方式五-form-data"><span>1.4.5. 方式五：form-data</span></a></h4><p>请求地址：http://localhost:8000/login</p><p>body是form-data格式：</p><p><img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" alt="图片" loading="lazy">form-data</p><p>解析body中的数据，我们需要使用multer</p><ul><li>安装依赖：<code>npm install koa-multer</code>;</li><li>使用 <code>multer</code>中间件；</li></ul><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const upload = multer({</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use(upload.any());</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(ctx.req.body);</span></span>
<span class="line"><span>  ctx.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们知道multer还可以实现文件的上传：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const storage = multer.diskStorage({</span></span>
<span class="line"><span>  destination: (req, file, cb) =&gt; {</span></span>
<span class="line"><span>    cb(null, &quot;./uploads/&quot;)</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  filename: (req, file, cb) =&gt; {</span></span>
<span class="line"><span>    cb(null, Date.now() + path.extname(file.originalname))</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const upload = multer({</span></span>
<span class="line"><span>  storage</span></span>
<span class="line"><span>});</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const fileRouter = new Router();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>fileRouter.post(&quot;/upload&quot;, upload.single(&#39;avatar&#39;), (ctx, next) =&gt; {</span></span>
<span class="line"><span>  console.log(ctx.req.file);</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use(fileRouter.routes());</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-响应方式" tabindex="-1"><a class="header-anchor" href="#_1-5-响应方式"><span>1.5. 响应方式</span></a></h3><p><strong>输出结果：body</strong></p><p>将响应主体设置为以下之一：</p><ul><li><code>string</code> ：字符串数据</li><li><code>Buffer</code> ：Buffer数据</li><li><code>Stream</code> ：流数据</li><li><code>Object</code>|| <code>Array</code>：对象或者数组</li><li><code>null</code> ：不输出任何内容</li></ul><p>如果<code>response.status</code>尚未设置，Koa会自动将状态设置为<code>200</code>或<code>204</code>。</p><p>比较常见的输出方式：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>ctx.response.body = &quot;Hello World&quot;;</span></span>
<span class="line"><span>ctx.body = {</span></span>
<span class="line"><span>  name: &quot;why&quot;,</span></span>
<span class="line"><span>  age: 18,</span></span>
<span class="line"><span>  height: 1.88</span></span>
<span class="line"><span>};</span></span>
<span class="line"><span>ctx.body = [&quot;abc&quot;, &quot;cba&quot;, &quot;nba&quot;];</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>疑惑：<code>ctx.response.body</code>和<code>ctx.body</code>之间的区别：</p><ul><li>事实上，我们访问ctx.body时，本质上是访问ctx.response.body；</li><li>我们可以看到源码中，我们访问 proto（这里就是ctx），其实是访问proto中的response的属性；</li></ul><p><img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" alt="图片" loading="lazy">image-20201104155927483</p><p><strong>请求状态：status</strong></p><p>请求状态我们可以直接给ctx设置，或者给ctx.response设置也是一样的效果：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>ctx.status = 201;</span></span>
<span class="line"><span>ctx.response.status = 204;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-6-错误处理" tabindex="-1"><a class="header-anchor" href="#_1-6-错误处理"><span>1.6. 错误处理</span></a></h3><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const Koa = require(&#39;koa&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const app = new Koa();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use((ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.app.emit(&#39;error&#39;, new Error(&quot;哈哈哈&quot;), ctx);</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.on(&#39;error&#39;, (err, ctx) =&gt; {</span></span>
<span class="line"><span>  console.log(err.message);</span></span>
<span class="line"><span>  ctx.response.body = &quot;哈哈哈&quot;;</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.listen(8000, () =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;错误处理服务启动成功~&quot;);</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-7-静态服务器" tabindex="-1"><a class="header-anchor" href="#_1-7-静态服务器"><span>1.7. 静态服务器</span></a></h3><p>koa并没有内置部署相关的功能，所以我们需要使用第三方库：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>npm install koa-static</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>部署的过程类似于express：</p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const Koa = require(&#39;koa&#39;);</span></span>
<span class="line"><span>const static = require(&#39;koa-static&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const app = new Koa();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use(static(&#39;./build&#39;));</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.listen(8000, () =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;静态服务器启动成功~&quot;);</span></span>
<span class="line"><span>});</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-8-源码解析" tabindex="-1"><a class="header-anchor" href="#_1-8-源码解析"><span>1.8. 源码解析</span></a></h3><p>视频里面有讲解，这里不再截图</p><h2 id="二-和express对比" tabindex="-1"><a class="header-anchor" href="#二-和express对比"><span>二. 和express对比</span></a></h2><p>在学习了两个框架之后，我们应该已经可以发现koa和express的区别：</p><p>从架构设计上来说：</p><ul><li><p>express是完整和强大的，其中帮助我们内置了非常多好用的功能；</p></li><li><p>koa是简洁和自由的，它只包含最新的功能，并不会对我们使用其他中间件进行任何的限制。</p></li><li><ul><li>甚至是在app中连最基本的get、post都没有给我们提供；</li></ul></li><li><p>我们需要通过自己或者路由来判断请求方式或者其他功能；</p></li></ul><p>因为express和koa框架他们的核心其实都是中间件：</p><ul><li>但是他们的中间件事实上，它们的中间件的执行机制是不同的，特别是针对某个中间件中包含异步操作时；</li><li>所以，接下来，我们再来研究一下express和koa中间件的执行顺序问题；</li></ul><p>我通过一个需求来演示所有的过程：</p><ul><li><p>假如有三个中间件会在一次请求中匹配到，并且按照顺序执行；</p></li><li><p>我希望最终实现的方案是：</p></li><li><ul><li>注意：是middleware1中；</li></ul></li><li><p>在middleware1中，在req.message中添加一个字符串 <code>aaa</code>；</p></li><li><p>在middleware2中，在req.message中添加一个 字符串<code>bbb</code>；</p></li><li><p>在middleware3中，在req.message中添加一个 字符串<code>ccc</code>；</p></li><li><p>当所有内容添加结束后，在middleware1中，通过res返回最终的结果；</p></li></ul><h3 id="_2-1-同步执行顺序" tabindex="-1"><a class="header-anchor" href="#_2-1-同步执行顺序"><span>2.1. 同步执行顺序</span></a></h3><p>假如我们获取的所有数据，是可以同步获取的；</p><p><strong>我们先通过express实现这个过程：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const express = require(&#39;express&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const app = express();</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware1 = (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = &quot;aaa&quot;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>  res.end(req.message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware2 = (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = req.message + &#39;bbb&#39;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware3 = (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = req.message + &#39;ccc&#39;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use(middleware1, middleware2, middleware3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.listen(8000, () =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;启动成功~&quot;);</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的结果是：<code>aaabbbccc</code>，没问题；</p><p><strong>我们再通过koa实现这个过程：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const Koa = require(&#39;koa&#39;);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const app = new Koa();</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware1 = (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = &quot;aaa&quot;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>  console.log(&quot;aaaa&quot;);</span></span>
<span class="line"><span>  ctx.body = ctx.message;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware2 = (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = ctx.message + &#39;bbb&#39;;</span></span>
<span class="line"><span>  console.log(&quot;bbbb&quot;);</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware3 = (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = ctx.message + &#39;ccc&#39;;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.use(middleware1);</span></span>
<span class="line"><span>app.use(middleware2);</span></span>
<span class="line"><span>app.use(middleware3);</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.listen(8000, () =&gt; {</span></span>
<span class="line"><span>  console.log(&quot;启动成功~&quot;);</span></span>
<span class="line"><span>})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的结果也是：<code>aaabbbccc</code>，也没问题；</p><h3 id="_2-2-异步执行顺序" tabindex="-1"><a class="header-anchor" href="#_2-2-异步执行顺序"><span>2.2. 异步执行顺序</span></a></h3><p>但是，如果我们最后的ccc中的结果，是需要异步操作才能获取到的，是否会产生问题呢？</p><h4 id="_2-2-1-express中遇到异步操作" tabindex="-1"><a class="header-anchor" href="#_2-2-1-express中遇到异步操作"><span>2.2.1. express中遇到异步操作</span></a></h4><p><strong>express有异步操作（没有在next前，加async、await）：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const middleware1 = (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = &quot;aaa&quot;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>  res.end(req.message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware2 = (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = req.message + &#39;bbb&#39;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware3 = async (req, res, next) =&gt; {</span></span>
<span class="line"><span>  const result = await axios.get(&#39;http://123.207.32.32:9001/lyric?id=167876&#39;);</span></span>
<span class="line"><span>  req.message = req.message + result.data.lrc.lyric;</span></span>
<span class="line"><span>  console.log(req.message);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的结果<code>aaabbb</code>，是不正确。</p><p><strong>express有异步操作（有在next前，加async、await）：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const middleware1 = async (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = &quot;aaa&quot;;</span></span>
<span class="line"><span>  await next();</span></span>
<span class="line"><span>  res.end(req.message);</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware2 = async (req, res, next) =&gt; {</span></span>
<span class="line"><span>  req.message = req.message + &#39;bbb&#39;;</span></span>
<span class="line"><span>  await next();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware3 = async (req, res, next) =&gt; {</span></span>
<span class="line"><span>  const result = await axios.get(&#39;http://123.207.32.32:9001/lyric?id=167876&#39;);</span></span>
<span class="line"><span>  req.message = req.message + result.data.lrc.lyric;</span></span>
<span class="line"><span>  console.log(req.message);</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的结果也是<code>aaabbb</code>，也是不正确。</p><p>为什么呢？</p><ul><li>原因是本质上的next()和异步没有任何关系；</li><li>它本身就是一个同步函数的调用，所以它不会等到你异步有结果之后，再继续执行后续的操作；</li></ul><p><img src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==" alt="图片" loading="lazy">image-20201106175205300</p><h4 id="_2-2-2-koa中遇到异步操作" tabindex="-1"><a class="header-anchor" href="#_2-2-2-koa中遇到异步操作"><span>2.2.2. koa中遇到异步操作</span></a></h4><p><strong>koa有异步操作（没有在next前，加async、await）：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const middleware1 = async (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = &quot;aaa&quot;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>  ctx.body = ctx.message;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware2 = async (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = ctx.message + &#39;bbb&#39;;</span></span>
<span class="line"><span>  next();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware3 = async (ctx, next) =&gt; {</span></span>
<span class="line"><span>  const result = await axios.get(&#39;http://123.207.32.32:9001/lyric?id=167876&#39;);</span></span>
<span class="line"><span>  ctx.message = ctx.message + result.data.lrc.lyric;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的结果也是<code>aaabbb</code>，也是不正确。</p><ul><li>这是因为虽然next函数是一个返回promise的异步操作，但是在前面不加await的情况，是不同等待结果的返回，就会继续向后执行了；</li></ul><p><strong>koa有异步操作（有在next前，加async、await）：</strong></p><div class="language- line-numbers-mode" data-highlighter="shiki" data-ext="" data-title="" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes github-light one-dark-pro vp-code"><code><span class="line"><span>const middleware1 = async (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = &quot;aaa&quot;;</span></span>
<span class="line"><span>  await next();</span></span>
<span class="line"><span>  ctx.body = ctx.message;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware2 = async (ctx, next) =&gt; {</span></span>
<span class="line"><span>  ctx.message = ctx.message + &#39;bbb&#39;;</span></span>
<span class="line"><span>  await next();</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span></span></span>
<span class="line"><span>const middleware3 = async (ctx, next) =&gt; {</span></span>
<span class="line"><span>  const result = await axios.get(&#39;http://123.207.32.32:9001/lyric?id=167876&#39;);</span></span>
<span class="line"><span>  ctx.message = ctx.message + result.data.lrc.lyric;</span></span>
<span class="line"><span>}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最终的结果是<code>aaabbb+歌词信息</code>，是正确。</p><ul><li>这是因为，当我们在koa中的next前面加await时，它会等到后续有一个确定结果时，在执行后续的代码；</li></ul>`,129),p=[l];function d(c,r){return a(),n("div",null,p)}const u=s(i,[["render",d],["__file","Node基础十一.html.vue"]]),v=JSON.parse('{"path":"/zh/posts/node/base/Node%E5%9F%BA%E7%A1%80%E5%8D%81%E4%B8%80.html","title":"Node基础十一","lang":"zh-CN","frontmatter":{"title":"Node基础十一","date":"2022-10-01T12:31:50.000Z","categories":"Node","tags":"Node Node基础系列","pre":"Node基础十","next":"Node基础十二","description":"十一.koa开发web服务器 Koa初体验 1.1. 认识Koa 前面我们已经学习了express，另外一个非常流行的Node Web服务器框架就是Koa。 Koa官方的介绍： koa：next generation web framework for node.js； koa：node.js的下一代web框架； 事实上，koa是express同一个团...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/zh/posts/node/base/Node%E5%9F%BA%E7%A1%80%E5%8D%81%E4%B8%80.html"}],["meta",{"property":"og:site_name","content":"博客"}],["meta",{"property":"og:title","content":"Node基础十一"}],["meta",{"property":"og:description","content":"十一.koa开发web服务器 Koa初体验 1.1. 认识Koa 前面我们已经学习了express，另外一个非常流行的Node Web服务器框架就是Koa。 Koa官方的介绍： koa：next generation web framework for node.js； koa：node.js的下一代web框架； 事实上，koa是express同一个团..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXusUoicD7NHXV5rLv2RQouhMqM41ZibicHx6BfUYLjkQic0jIVBjkwr5gib3vPBhIUBZlLicjUwruFLAfqnQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-06-19T08:58:34.000Z"}],["meta",{"property":"article:author","content":"chriswoodcn"}],["meta",{"property":"article:published_time","content":"2022-10-01T12:31:50.000Z"}],["meta",{"property":"article:modified_time","content":"2024-06-19T08:58:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Node基础十一\\",\\"image\\":[\\"https://mmbiz.qpic.cn/mmbiz_jpg/O8xWXzAqXusUoicD7NHXV5rLv2RQouhMqM41ZibicHx6BfUYLjkQic0jIVBjkwr5gib3vPBhIUBZlLicjUwruFLAfqnQ/640?wx_fmt=jpeg&wxfrom=5&wx_lazy=1&wx_co=1\\",\\"data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==\\",\\"data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==\\",\\"data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==\\"],\\"datePublished\\":\\"2022-10-01T12:31:50.000Z\\",\\"dateModified\\":\\"2024-06-19T08:58:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"chriswoodcn\\"}]}"]]},"headers":[{"level":2,"title":"十一.koa开发web服务器","slug":"十一-koa开发web服务器","link":"#十一-koa开发web服务器","children":[]},{"level":2,"title":"Koa初体验","slug":"koa初体验","link":"#koa初体验","children":[{"level":3,"title":"1.1. 认识Koa","slug":"_1-1-认识koa","link":"#_1-1-认识koa","children":[]},{"level":3,"title":"1.2. koa初体验","slug":"_1-2-koa初体验","link":"#_1-2-koa初体验","children":[]},{"level":3,"title":"1.3. 路由的使用","slug":"_1-3-路由的使用","link":"#_1-3-路由的使用","children":[]},{"level":3,"title":"1.4. 请求解析","slug":"_1-4-请求解析","link":"#_1-4-请求解析","children":[]},{"level":3,"title":"1.5. 响应方式","slug":"_1-5-响应方式","link":"#_1-5-响应方式","children":[]},{"level":3,"title":"1.6. 错误处理","slug":"_1-6-错误处理","link":"#_1-6-错误处理","children":[]},{"level":3,"title":"1.7. 静态服务器","slug":"_1-7-静态服务器","link":"#_1-7-静态服务器","children":[]},{"level":3,"title":"1.8. 源码解析","slug":"_1-8-源码解析","link":"#_1-8-源码解析","children":[]}]},{"level":2,"title":"二. 和express对比","slug":"二-和express对比","link":"#二-和express对比","children":[{"level":3,"title":"2.1. 同步执行顺序","slug":"_2-1-同步执行顺序","link":"#_2-1-同步执行顺序","children":[]},{"level":3,"title":"2.2. 异步执行顺序","slug":"_2-2-异步执行顺序","link":"#_2-2-异步执行顺序","children":[]}]}],"git":{"createdTime":1718787514000,"updatedTime":1718787514000,"contributors":[{"name":"chriswoodcn","email":"chriswoodcn@aliyun.com","commits":1}]},"readingTime":{"minutes":8.67,"words":2600},"filePathRelative":"zh/posts/node/base/Node基础十一.md","localizedDate":"2022年10月1日","excerpt":"<h2>十一.koa开发web服务器</h2>\\n<h2>Koa初体验</h2>\\n<h3>1.1. 认识Koa</h3>\\n<p>前面我们已经学习了express，另外一个非常流行的Node Web服务器框架就是Koa。</p>\\n<p>Koa官方的介绍：</p>\\n<ul>\\n<li>koa：next generation web framework for node.js；</li>\\n<li>koa：node.js的下一代web框架；</li>\\n</ul>\\n<p>事实上，koa是express同一个团队开发的一个新的Web框架：</p>\\n<ul>\\n<li>目前团队的核心开发者TJ的主要精力也在维护Koa，express已经交给团队维护了；</li>\\n<li>Koa旨在为Web应用程序和API提供更小、更丰富和更强大的能力；</li>\\n<li>相对于express具有更强的异步处理能力（后续我们再对比）；</li>\\n<li>Koa的核心代码只有1600+行，是一个更加轻量级的框架，我们可以根据需要安装和使用中间件；</li>\\n</ul>","autoDesc":true}');export{u as comp,v as data};
