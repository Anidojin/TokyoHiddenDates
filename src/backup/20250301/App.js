import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

function SpotDetail({ spots }) {
  const spotId = window.location.pathname.split("/")[2];
  const spot = spots.find((s) => s.id === spotId);
  if (!spot) return <div className="p-4 max-w-2xl mx-auto text-gray-500">スポットが見つかりません</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">{spot.name}</h1>
      <Carousel showThumbs={false} className="mb-6">
        {spot.image_urls.map((url, idx) => (
          <div key={idx}>
            <img src={url} alt={spot.name} className="h-96 object-cover rounded" />
          </div>
        ))}
      </Carousel>
      <p className="text-lg mb-2">{spot.description}</p>
      <p className="text-md mb-4">料金: {spot.price}</p>
      <a href={`https://maps.google.com/?q=${spot.location}`} target="_blank" className="text-blue-600 hover:underline">
        地図を見る
      </a>
      <button className="block mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
        スポットを予約
      </button>
      <Link to="/" className="block mt-4 text-blue-600 hover:underline">一覧に戻る</Link>
    </div>
  );
}

function App() {
  const [spots, setSpots] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchSpots = async () => {
      const querySnapshot = await getDocs(collection(db, "spots"));
      setSpots(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchSpots();
  }, []);

  const filteredSpots = spots.filter(
    (spot) =>
      (spot.name.toLowerCase().includes(search.toLowerCase()) ||
       spot.location.toLowerCase().includes(search.toLowerCase()) ||
       spot.description.toLowerCase().includes(search.toLowerCase())) &&
      (!category || spot.category === category)
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-6 text-center">東京近郊の穴場デートスポット</h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="スポットを検索..."
                  className="w-full sm:w-2/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full sm:w-1/3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">すべてのカテゴリ</option>
                  <option value="自然">自然</option>
                  <option value="カフェ">カフェ</option>
                  <option value="歴史">歴史</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredSpots.length > 0 ? (
                  filteredSpots.map((spot) => (
                    <Link to={`/spot/${spot.id}`} key={spot.id}>
                      <div className="border rounded-lg shadow-md hover:shadow-lg transition bg-white overflow-hidden">
                        <img src={spot.image_urls[0]} alt={spot.name} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h2 className="text-xl font-semibold">{spot.name}</h2>
                          <p className="text-gray-600">{spot.location}</p>
                          <p className="text-sm text-gray-500 mt-1 truncate">{spot.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full">スポットが見つかりません</p>
                )}
              </div>
            </div>
          }
        />
        <Route path="/spot/:id" element={<SpotDetail spots={spots} />} />
      </Routes>
    </Router>
  );
}

export default App;