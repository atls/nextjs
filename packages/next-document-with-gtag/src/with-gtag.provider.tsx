/* eslint-disable @next/next/no-document-import-in-page, @next/next/next-script-for-ga */

import type { DocumentContext, DocumentInitialProps } from 'next/document'

import type Document                                  from 'next/document'

import React                                          from 'react'

export const withGtag = (gaTrackingId?: string) => (TargetComponent: typeof Document) =>
  class WithGtag extends TargetComponent {
    static override async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
      const props = await super.getInitialProps(context)

      if (gaTrackingId) {
        props.head ??= []
        props.head.push(
          <script
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gaTrackingId}');
      `,
            }}
          />
        )
      }

      return props
    }
  }
