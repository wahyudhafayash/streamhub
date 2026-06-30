import type { Metadata } from "next";
import { Inter, VT323 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const pixel = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Fay4ssz | The Premium Profile",
  description:
    "All your links, latest videos, and live status in one premium profile.",
  openGraph: {
    title: "Fay4ssz | The Premium Profile",
    description:
      "All your links, latest videos, and live status in one premium profile.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fay4ssz | The Premium Profile",
    description:
      "All your links, latest videos, and live status in one premium profile.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${pixel.variable}`}
      suppressHydrationWarning
    >
      <body
        className="font-sans bg-[#fef6e4] text-neutral-900 antialiased selection:bg-pink-300/50"
        suppressHydrationWarning
      >
        <Script
          id="fetch-polyfill-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                try {
                  var origDefineProperty = Object.defineProperty;
                  Object.defineProperty = function(obj, prop, descriptor) {
                    if (obj === window && prop === 'fetch') {
                      if (descriptor.get && !descriptor.set) {
                        var originalGet = descriptor.get;
                        var overrideValue = undefined;
                        descriptor.get = function() { 
                          return overrideValue !== undefined ? overrideValue : originalGet.call(this); 
                        };
                        descriptor.set = function(val) { 
                          overrideValue = val; 
                        };
                        descriptor.configurable = true;
                      } else if ('value' in descriptor && !descriptor.writable) {
                        descriptor.writable = true;
                        descriptor.configurable = true;
                      }
                    }
                    return origDefineProperty.call(Object, obj, prop, descriptor);
                  };
                  
                  var originalFetch = window.fetch;
                  origDefineProperty(window, 'fetch', {
                    configurable: true,
                    enumerable: true,
                    get: function() { return originalFetch; },
                    set: function(val) { originalFetch = val; }
                  });
                } catch(e) { console.error("Fetch fix error:", e); }
              }
            `,
          }}
        />
        {/* Retro Game Grid Background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, #000 31px, #000 32px), repeating-linear-gradient(90deg, transparent, transparent 31px, #000 31px, #000 32px)`,
            backgroundSize: "32px 32px",
          }}
        ></div>

        {/* Floating Game Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex flex-wrap justify-between items-evenly opacity-10 filter grayscale sepia">
          <div className="absolute top-[10%] left-[5%] text-8xl -rotate-12">
            🍄
          </div>
          <div className="absolute top-[30%] right-[10%] text-9xl rotate-12">
            🌟
          </div>
          <div className="absolute top-[60%] left-[15%] text-7xl -rotate-6">
            🪙
          </div>
          <div className="absolute bottom-[20%] right-[20%] text-8xl rotate-45">
            🐢
          </div>
          <div className="absolute bottom-[5%] left-[30%] text-9xl -rotate-12">
            🧱
          </div>
          <div className="absolute top-[80%] right-[5%] text-8xl -rotate-12">
            👾
          </div>
        </div>

        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
