import { createFirebaseAdminApp } from 'src/lib/createFireBaseAdminApp';
const { db } = createFirebaseAdminApp();
// const host = process.env.NODE_ENV === 'development' ? 'http://192.168.0.220:5002' : 'https://scc-prod.vercel.app'; /* : 'https://www.scc.com'; */
const initPosts = [];
let postDocs = [];

try {
  const postRef = db.collection('posts').orderBy('timestamp', 'desc');

  console.log('init ran');
  // take over as listener
  postRef.onSnapshot(
    (snapshot) => {
      postDocs = [];
      snapshot.forEach((doc) => {
        postDocs.push({ id: doc.id, data: doc.data() });
      });
      // const data = snapshot.docs.map((doc) => ({
      //   id: doc.id,
      //   // ...doc.data(),
      //   data: { ...doc.data(), timestamp: doc.data().timestamp?.toDate().getTime() },
      // }));
      // ...
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
  // running an initial get to setup first getStaticProps otherwise they are [] empty, then listener can take over above
  const initSnap = await postRef.get();
  initSnap.forEach((doc) => {
    initPosts.push({ id: doc.id, data: doc.data() });
  });
} catch (err) {
  // If there was an error, Next.js will continue
  // to show the last successfully generated page
  // return res.status(500).json({ reason: 'Error Reading Posts', error: err });
  console.log(err);
}

// await new Promise((resolve) => setTimeout(resolve, 1000));

export default async function handler(req, res) {
  console.log(postDocs.length);
  console.log('init bakup', initPosts.length);
  // Check for secret to confirm this is a valid request
  if (req.method === 'OPTIONS') return res.status(200).send(); // takes care of browser preflight

  if (req.body.api_key !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send('Not Authorised To Access This API');
  } else return res.status(200).json(postDocs.length ? postDocs : initPosts);
}
