import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function SpotDetail({ spots }) {
  const spotId = window.location.pathname.split("/")[2]; // URLからID取得
  const spot = spots.find((s) => s.id === spotId);
  if (!spot) return <div className="p-4 max-w-md mx-auto">スポットが見つかりません</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">{spot.name}</h1>
      <Carousel showThumbs={false}>
        {spot.image_urls.map((url, idx) => (
          <div key={idx}>
            <img src={url} alt={spot.name} className="h-64 object-cover" />
          </div>
        ))}
      </Carousel>
      <p className="mt-2">{spot.description}</p>
      <p className="mt-2">料金: {spot.price}</p>
      <a href={`https://maps.google.com/?q=${spot.location}`} target="_blank" className="text-blue-500">
        地図
      </a>
      <Link to="/" className="block mt-4 text-blue-500">戻る</Link>
    </div>
  );
}

function App() {
  const [spots, setSpots] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      const querySnapshot = await getDocs(collection(db, "spots"));
      setSpots(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchSpots();
  }, []);

  const filteredSpots = spots.filter(
    (spot) =>
      spot.name.toLowerCase().includes(search.toLowerCase()) ||
      spot.location.toLowerCase().includes(search.toLowerCase()) ||
      spot.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-4 max-w-md mx-auto">
              <h1 className="text-2xl font-bold mb-4">東京近郊の穴場デートスポット</h1>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="スポットを検索..."
                className="w-full p-2 mb-4 border rounded"
              />
              {filteredSpots.length > 0 ? (
                filteredSpots.map((spot) => (
                  <Link to={`/spot/${spot.id}`} key={spot.id}>
                    <div className="border p-4 mb-4 rounded shadow">
                      <h2 className="text-xl">{spot.name}</h2>
                      <p>{spot.location}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500">スポットが見つかりません</p>
              )}
            </div>
          }
        />
        <Route path="/spot/:id" element={<SpotDetail spots={spots} />} />
      </Routes>
    </Router>
  );
}

export default App;