import type { Context, Config } from '@netlify/edge-functions'

// Detects mobile phones from the User-Agent string. The "Mobile" token in an
// Android UA distinguishes phones from tablets; iPhone/iPod/Windows Phone/etc.
// cover the remaining common phone platforms.
const PHONE_UA =
  /(Android.*Mobile|iPhone|iPod|Windows Phone|BlackBerry|BB10|Opera Mini|IEMobile|Mobile Safari)/i

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>404 - Page Not Found</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: #fff;
        color: #111;
        text-align: center;
      }
      .code { font-size: 64px; font-weight: 700; margin: 0; }
      .msg { font-size: 18px; color: #555; margin-top: 8px; }
    </style>
  </head>
  <body>
    <div>
      <p class="code">404</p>
      <p class="msg">Page not found</p>
    </div>
  </body>
</html>`

export default async (req: Request, context: Context) => {
  const country = context.geo?.country?.code
  const userAgent = req.headers.get('user-agent') || ''

  const isSaudiArabia = country === 'SA'
  const isPhone = PHONE_UA.test(userAgent)

  // Only visitors who are both inside Saudi Arabia and on a phone may proceed.
  if (isSaudiArabia && isPhone) {
    return // pass through to the site
  }

  return new Response(NOT_FOUND_HTML, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

export const config: Config = {
  path: '/*',
}
