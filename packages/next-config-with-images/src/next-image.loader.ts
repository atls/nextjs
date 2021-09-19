import loaderUtils     from 'next/dist/compiled/loader-utils'
import { resizeImage } from 'next/dist/server/image-optimizer'
import sizeOf          from 'image-size'

const BLUR_IMG_SIZE = 8
const BLUR_QUALITY = 70
const VALID_BLUR_EXT = ['jpeg', 'png', 'webp']

function nextImageLoader(content) {
  const imageLoaderSpan = this.currentTraceSpan.traceChild('next-image-loader')
  return imageLoaderSpan.traceAsyncFn(async () => {
    const { isServer, isDev, assetPrefix } = loaderUtils.getOptions(this)
    const context = this.rootContext
    const opts = { context, content }
    const interpolatedName = loaderUtils.interpolateName(
      this,
      '/static/image/[name].[hash].[ext]',
      opts
    )

    // eslint-disable-next-line
    const outputPath = '/_next' + interpolatedName

    let extension = loaderUtils.interpolateName(this, '[ext]', opts)
    if (extension === 'jpg') {
      extension = 'jpeg'
    }

    const imageSizeSpan = imageLoaderSpan.traceChild('image-size-calculation')
    const imageSize = imageSizeSpan.traceFn(() => sizeOf(content))
    let blurDataURL

    if (VALID_BLUR_EXT.includes(extension)) {
      if (isDev) {
        const prefix = 'http://localhost'
        const url = new URL('/_next/image', prefix)
        url.searchParams.set('url', assetPrefix + outputPath)
        url.searchParams.set('w', String(BLUR_IMG_SIZE))
        url.searchParams.set('q', String(BLUR_QUALITY))
        blurDataURL = url.href.slice(prefix.length)
      } else {
        // Shrink the image's largest dimension
        const dimension = imageSize.width >= imageSize.height ? 'width' : 'height'

        const resizeImageSpan = imageLoaderSpan.traceChild('image-resize')
        const resizedImage = await resizeImageSpan.traceAsyncFn(() =>
          resizeImage(content, dimension, BLUR_IMG_SIZE, extension, BLUR_QUALITY)
        )
        const blurDataURLSpan = imageLoaderSpan.traceChild('image-base64-tostring')
        blurDataURL = blurDataURLSpan.traceFn(
          () => `data:image/${extension};base64,${resizedImage.toString('base64')}`
        )
      }
    }

    const stringifiedData = imageLoaderSpan.traceChild('image-data-stringify').traceFn(() =>
      JSON.stringify({
        src: outputPath,
        height: imageSize.height,
        width: imageSize.width,
        blurDataURL,
      })
    )

    if (!isServer) {
      this.emitFile(interpolatedName, content, null)
    }

    return `export default ${stringifiedData};`
  })
}

export const raw = true
export default nextImageLoader
