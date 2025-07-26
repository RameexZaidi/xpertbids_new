// pages/_app.js
import App from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider, useSession } from 'next-auth/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SeoHeader from '../components/SeoHeader'

const queryClient = new QueryClient()

function AuthWrapper({ children }) {
  const { status } = useSession()
  if (status === 'loading') return null
  return <>{children}</>
}

function MyApp({ Component, pageProps, seoMeta }) {
  // Client‐side log
  

  useEffect(() => {
    window.OneSignal = window.OneSignal || []
    OneSignal.push(() => {
      OneSignal.init({
        appId: '5501deaf-0664-4aa6-8bad-ac3f4c7532f5',
        safari_web_id: 'YOUR_SAFARI_WEB_ID',
      })
      OneSignal.showNativePrompt()
    })
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" href="/assets/images/Group-1.png" />
        
        {/* …other global tags… */}
      </Head>

      <SeoHeader meta={seoMeta} />

      <SessionProvider session={pageProps.session}>
        <GoogleOAuthProvider clientId="971421469748-k1qicbfj8298bb9notpe8cfijcvf9t40.apps.googleusercontent.com">
          <QueryClientProvider client={queryClient}>
            <AuthWrapper>
              <Component {...pageProps} />
            </AuthWrapper>
          </QueryClientProvider>
        </GoogleOAuthProvider>
      </SessionProvider>
    </>
  )
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext)
  const { ctx } = appContext

  // pick up either [slug] or [id], or fallback to pathname
  const slug =
    ctx.query.slug ||
    ctx.query.id ||
    (ctx.pathname === '/' ? 'Xpertbid : The Best Auction in Town' : ctx.pathname.replace(/^\/|\/$/g, ''))

  //console.log('🚀 Next.js will fetch SEO for slug:', slug)

  let seoMeta = { slug, meta_title:'XpertBid', /* defaults */ }
  try {
    const res = await fetch(`https://admin.xpertbid.com/api/seo/${slug}`)
   // console.log(`Fetch status for /api/seo/${slug}:`, res.status)
    if (res.ok) {
      seoMeta = await res.json()
    //  console.log('Parsed JSON:', seoMeta)
    } else {
     // console.warn('Non-OK response:', await res.text())
    }
  } catch (err) {
    console.error('Fetch threw error:', err)
  }
  

  return { ...appProps, seoMeta }
}


export default MyApp
