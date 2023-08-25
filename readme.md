# awaitable-ws
    websocket的 .on() 模式使代码分散、难以跟踪，可读性极差，并且执行顺序难以确定。让开发者产生了不必要的大量负担。
    
    awaitable-ws 是一个promise化的 webscoket 客户端，解决了上述问题，让开发者可以直接使用 async/await 写出可读性高、便于维护的客户端 ws代码。

    对应的 webscoket 服务端只需要将收到的参数中的 id 原封不动的传回客户端即可。

    另外，awaitable-ws通过添加 taro 和 ws 的实现，兼容浏览器以及 node.js、小程序 的使用场景。
    
### 安装
    pnpm add awaitable-ws

### 使用
```typescript
    import awaitableWs from "./index.js";

    const ws = new awaitableWs({ url });
    
    const res = await ws.send({ arg1: "arg1" });

```

### 测试及示例
    pnpm install
#### 启动测试服务器
    pnpm testserver
#### 启动 node.js 环境的客户端示例
    pnpm testserver
#### 启动 浏览器 环境的客户端示例
    pnpm webclient
#### 查看 taro 环境的的客户端示例
    https://github.com/skzhangyawuzhua/awaitable-ws-taro-demo
