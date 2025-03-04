import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
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
      <a href={`https://maps.google.com/?q=${spot.location}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
        地図を見る
      </a>
      <button className="block mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
        スポットを予約
      </button>
      <Link to="/" className="block mt-4 text-blue-600 hover:underline">一覧に戻る</Link>
    </div>
  );
}

function MainApp({ spots, setSpots }) {
  const [search, setSearch] = useState("");
  const [majorCategory, setMajorCategory] = useState("");
  const [minorCategory, setMinorCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "spots"));
        setSpots(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        console.log("データ取得成功:", querySnapshot.docs.length, "件");
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };
    if (spots.length === 0) fetchSpots(); // 初回のみ取得
  }, [spots, setSpots]);

  const categories = {
    "定番デートスポット": ["テーマパーク・遊園地", "水族館・動物園", "映画館", "展望台・夜景スポット"],
    "アウトドア系": ["公園・ピクニック", "ハイキング・登山", "ビーチ・海沿いスポット", "キャンプ・グランピング"],
    "文化・アート系": ["美術館・博物館", "歴史的建造物・神社仏閣", "ギャラリー・アートイベント"],
    "体験・アクティビティ系": ["クルージング", "ボルダリング・スポーツ施設", "陶芸・ガラス工芸体験", "VR・ゲームセンター"],
    "カフェ・グルメ系": ["おしゃれカフェ", "食べ歩きスポット", "バー・居酒屋", "スイーツ専門店"],
    "シーズン・イベント系": ["花火大会・イルミネーション", "桜・紅葉スポット", "クリスマスマーケット", "夏祭り・縁日"],
    "ちょっと変わったデートスポット": ["猫カフェ・動物カフェ", "ボードゲームカフェ・謎解きイベント", "プラネタリウム・星空鑑賞", "ホテルステイ・温泉旅行"]
  };

  const filteredSpots = spots.filter(
    (spot) =>
      (spot.name.toLowerCase().includes(search.toLowerCase()) ||
       spot.location.toLowerCase().includes(search.toLowerCase()) ||
       spot.description.toLowerCase().includes(search.toLowerCase())) &&
      (!majorCategory || spot.majorCategory === majorCategory) &&
      (!minorCategory || spot.minorCategory === minorCategory)
  );

  const handleMajorCategoryClick = (cat) => {
    setMajorCategory(cat === majorCategory ? "" : cat);
    setMinorCategory("");
    navigate("/");
  };

  return (
    <div>
      <div className="hero-section">
        <div className="nav-bar">
          {Object.keys(categories).map((cat) => (
            <Link
              key={cat}
              to="/"
              onClick={() => handleMajorCategoryClick(cat)}
              className={`nav-link ${majorCategory === cat ? "active" : ""}`}
            >
              {cat}
            </Link>
          ))}
        </div>
        <div className="search-box">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            東京近郊の穴場デートスポット
          </h1>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="スポットを検索..."
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={majorCategory}
                onChange={(e) => {
                  setMajorCategory(e.target.value);
                  setMinorCategory("");
                }}
                className="w-full sm:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">すべての大ジャンル</option>
                {Object.keys(categories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={minorCategory}
                onChange={(e) => setMinorCategory(e.target.value)}
                className="w-full sm:w-1/2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!majorCategory}
              >
                <option value="">すべての小ジャンル</option>
                {majorCategory &&
                  categories[majorCategory].map((subCat) => (
                    <option key={subCat} value={subCat}>{subCat}</option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 max-w-4xl mx-auto bg-white">
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
    </div>
  );
}

function AppWrapper() {
  const [spots, setSpots] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp spots={spots} setSpots={setSpots} />} />
        <Route path="/spot/:id" element={<SpotDetail spots={spots} />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;