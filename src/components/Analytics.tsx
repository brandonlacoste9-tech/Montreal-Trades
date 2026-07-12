"use client";

import Script from "next/script";

/**
 * Meta Pixel + Google Analytics 4 / Google Ads.
 * IDs from env (set on Netlify). Missing IDs = scripts not loaded.
 */
export default function Analytics() {
  const metaId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim(); // G-XXXXXXXX
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim(); // AW-XXXXXXXX

  const hasMeta = metaId && !/your-|placeholder|xxx/i.test(metaId);
  const hasGa = gaId && /^G-/.test(gaId);
  const hasAds = adsId && /^AW-/.test(adsId);

  // gtag config: GA4 and/or Google Ads
  const gtagIds = [hasGa ? gaId : null, hasAds ? adsId : null].filter(Boolean) as string[];
  const primaryGtag = gtagIds[0];

  return (
    <>
      {hasMeta && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaId}');
            fbq('track', 'PageView');
          `}</Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {primaryGtag && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${primaryGtag}`}
            strategy="afterInteractive"
          />
          <Script id="google-gtag" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            ${hasGa ? `gtag('config', '${gaId}');` : ""}
            ${hasAds ? `gtag('config', '${adsId}');` : ""}
          `}</Script>
        </>
      )}
    </>
  );
}

/** Call after successful homeowner form submit */
export function trackLeadSubmit() {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  };
  try {
    w.fbq?.("track", "Lead");
  } catch {
    /* ignore */
  }
  try {
    w.gtag?.("event", "generate_lead", {
      event_category: "form",
      event_label: "homeowner_quote",
    });
    const sendTo = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL?.trim();
    const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim();
    if (sendTo && adsId && w.gtag) {
      // Format: AW-XXXXX/label  OR full send_to
      const target = sendTo.includes("/") ? sendTo : `${adsId}/${sendTo}`;
      w.gtag("event", "conversion", { send_to: target });
    }
  } catch {
    /* ignore */
  }
}

/** Call when contractor starts checkout / lands on success */
export function trackSubscribe(plan?: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  };
  try {
    w.fbq?.("track", "Subscribe", { value: plan === "pro" ? 299 : 149, currency: "CAD" });
    w.fbq?.("track", "StartCheckout", { content_name: plan || "subscription" });
  } catch {
    /* ignore */
  }
  try {
    w.gtag?.("event", "begin_checkout", {
      currency: "CAD",
      value: plan === "pro" ? 299 : 149,
    });
  } catch {
    /* ignore */
  }
}
