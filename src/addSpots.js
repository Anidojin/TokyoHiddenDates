import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { initialSpots } from "./spotsData";

async function addSpotsToFirestore() {
  console.log("登録開始...");
  let successCount = 0;
  for (const spot of initialSpots) {
    try {
      await addDoc(collection(db, "spots"), spot);
      successCount++;
      console.log(`${spot.name} を追加しました (${successCount}/${initialSpots.length})`);
    } catch (error) {
      console.error(`${spot.name} の登録に失敗:`, error);
    }
  }
  console.log(`登録完了: ${successCount}/${initialSpots.length} 件成功`);
}

addSpotsToFirestore();