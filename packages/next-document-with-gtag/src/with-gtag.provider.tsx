import React    from 'react'
import Document from 'next/document'

export const withGtag = (gaTrackingId?: string) => (TargetComponent) =>
  class WithGtag extends TargetComponent {
    static async getInitialProps(context) {
      const props = await super.getInitialProps(context)

      if (gaTrackingId) {
        props.head.push(
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`} />
        )

        props.head.push(
          <script
            dangerouslySetInnerHTML={{
              __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag.pageview = function(info) {gtag('config', '${gaTrackingId}', info)}
        gtag('js', new Date());
        gtag.pageview({
          page_path: window.location.pathname,
          page_location: window.location.href,
        });
      `,
            }}
          />
        )
      }

      return props
    }

    static renderDocument(...args) {
      // @ts-ignore
      return Document.renderDocument(...args)
    }
  }
