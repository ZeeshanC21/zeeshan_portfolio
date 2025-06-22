// pages/_document.tsx (for Pages Router)
// OR app/layout.tsx (for App Router)

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* reCAPTCHA script for Firebase Phone Authentication */}
        <script 
          src="https://www.google.com/recaptcha/api.js?render=explicit" 
          async 
          defer
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// For App Router (app/layout.tsx), add the script tag to the head:
/*
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script 
          src="https://www.google.com/recaptcha/api.js?render=explicit" 
          async 
          defer
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
*/