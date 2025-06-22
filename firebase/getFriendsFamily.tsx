/* eslint-disable react/no-unescaped-entities */

import { collection , getDocs, Timestamp } from "firebase/firestore";
import { db } from "./config";

export interface LovedOnes{
    id:string,
    name:string,
    phoneNumber:string,
    personalMessage:string,
    totalAttempts:number,
    firstViewedAt:Timestamp,
    lastViewedAt:Timestamp,
    otp:string,
    otpExpiry:number
}

export async function getFriendsFamily():Promise<LovedOnes[]>{
    try{
        const snapshot=await getDocs(collection(db,"lovedones"));
        return snapshot.docs.map((doc)=>({
            id:doc.id,
            ...(doc.data() as Omit<LovedOnes,"id">),
        }));
    }catch(error){
        return [];
    }   
}