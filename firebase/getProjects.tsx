import { collection, getDocs } from "firebase/firestore";
import { db } from "./config";

export interface Project {
  id: string;
  title: string;
  description: string;
  githubLink?: string;
  techStack?: string[];
  image:string
}

export async function getProjects(): Promise<Project[]> {
  try {
    const snapshot = await getDocs(collection(db, "projects"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Project, "id">),
    }));
  } catch (error) {
    console.error("Firestore fetch failed:", error);
    return [];
  }
}
