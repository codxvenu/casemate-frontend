import db, { getUserbyEmail } from "@/lib/db"
import { authMiddleware } from "@/app/api/middleware/auth"
import jwt from "jsonwebtoken"
export async function GET(req,{params}) {
    try {
        const {fileId} = await params
        const user = await authMiddleware()
        if(!user) return Response.json({error : "User not authenticated"},{status : 400});
        await db.query(`delete from share where userId = ? and fileId = ?`,[user.id,fileId]);
        return Response.json({text : "revoked"},{status : 200})
    } catch (error) {
        return Response.json({error : error.message},{status : 500})
    }
}