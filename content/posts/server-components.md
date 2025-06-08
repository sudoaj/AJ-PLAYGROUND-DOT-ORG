---
title: "React Server Components"
date: "2024-04-02"
slug: "server-components"
excerpt: "A look into React Server Components, their benefits, and how they are changing the way we build React applications."
imageUrl: "/images/blog/server-components-flow.png"
imageHint: "React Server Components Data Flow"
---

# React Server Components: The Future of React Development

React Server Components (RSCs) are a groundbreaking addition to the React ecosystem, enabling developers to build applications that seamlessly span the server and client. By leveraging RSCs, you can combine the rich interactivity of client-side apps with the performance and scalability of server-rendered applications.

![React Server Components Data Flow](/images/blog/server-components-flow.png)

## What Are React Server Components?

React Server Components are components that run exclusively on the server. Unlike traditional React components, they never get sent to the client as JavaScript. Instead, they render to a special format that is streamed to the client, where it is combined with client components to produce the final UI.

> **Learn more:** [React Server Components RFC](https://github.com/reactjs/rfcs/pull/188)

## Key Advantages

- **Zero Bundle Size:** Server Components do not increase the JavaScript bundle sent to the client, resulting in faster load times.
- **Direct Backend Access:** They can access server-side resources (databases, files, secrets) directly, without exposing APIs.
- **Automatic Code Splitting:** Client Components imported by Server Components are automatically code-split.
- **Improved Performance:** By offloading rendering to the server, RSCs reduce client workload and improve app speed.

## How Do Server Components Work?

Server Components are rendered on the server and streamed to the client. The client receives a lightweight description of the UI, which is then hydrated with interactive Client Components as needed.

### Example: Basic Server Component

```jsx
// app/components/ServerTime.server.js
export default function ServerTime() {
    const now = new Date().toLocaleString();
    return <div>Server time: {now}</div>;
}
```

This component runs only on the server and never ships its code to the browser.

### Mixing Server and Client Components

You can combine Server and Client Components for optimal performance and interactivity.

```jsx
// app/components/Counter.client.js
import { useState } from 'react';

export default function Counter() {
    const [count, setCount] = useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}
```

```jsx
// app/page.js
import ServerTime from './components/ServerTime.server';
import Counter from './components/Counter.client';

export default function Page() {
    return (
        <div>
            <h1>React Server Components Demo</h1>
            <ServerTime />
            <Counter />
        </div>
    );
}
```

## When Should You Use Server Components?

- Fetching data from a database or API
- Rendering content that doesn't require interactivity
- Accessing sensitive resources (API keys, secrets)
- Reducing client bundle size

## Limitations

- Server Components cannot use browser-only APIs (like `window` or `document`)
- They cannot manage client-side state or handle events directly

## Resources

- [React Server Components Documentation](https://react.dev/reference/react-server-components)
- [Next.js Server Components](https://nextjs.org/docs/getting-started/react-architecture#server-components)
- [React Conf 2021: Introducing React Server Components](https://www.youtube.com/watch?v=SSR1OUGg6DU)

---

React Server Components are changing the way we build React applications, enabling faster, more scalable, and more secure apps. Start experimenting with RSCs today to unlock their full potential!

