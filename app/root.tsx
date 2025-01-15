import { Provider } from "react-redux";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import store from "./store";
import announcementBarStyle from "./routes/preview/announcement-bar.css";

export const links = () => [{ rel: "stylesheet", href: announcementBarStyle }];

export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="shopify-debug" content="web-vitals" />
        <script
          src="https://cdn.heymantle.com/mantle_apptrack.js?appToken=1e91e1c479498e38618cda89e8f799c3"
          defer
        ></script>
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>
          <Outlet />
          <ScrollRestoration />
          <LiveReload />
          <Scripts />
        </Provider>
      </body>
    </html>
  );
}
