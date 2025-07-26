// pages/favorites.js
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FavoriteItem from '../components/FavoriteItem';
import { getSession } from 'next-auth/react';

export default function FavoritesPage({ favorites }) {
  return (
    <>
      <Header />
      <section className="marketplace">
        <div className="container-fluid">
          <div className="fav-like-hdig pt-4">
            <h2>My Favorites</h2>
          </div>

          {favorites.length > 0 ? (
            <div className="row makt-parent">
              {favorites.map((item) => (
                <FavoriteItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p>You have no favorite items.</p>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  // 1) Prevent any caching
  context.res.setHeader(
    'Cache-Control',
    'no-store, no-cache, must-revalidate, max-age=0, proxy-revalidate'
  );

  // 2) Get the NextAuth session (reads your cookies)
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // 3) Fetch favorites from your API
  let favorites = [];
  try {
    const rsp = await fetch('https://admin.xpertbid.com/api/favorites', {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });
    const json = await rsp.json();
    favorites = json.favorites ?? [];
  } catch (e) {
    console.error('Error fetching favorites in SSR:', e);
  }

  // 4) Pass to the page as props
  return {
    props: { favorites },
  };
}
