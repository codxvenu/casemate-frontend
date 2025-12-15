import db, { getUserbyEmail } from "@/lib/db"
import { authMiddleware } from "@/app/api/middleware/auth"
import jwt from "jsonwebtoken"
export async function GET(req,{params}) {
    try {
        const {fileId} = await params
        const user = await authMiddleware()
        if(!user) return Response.json({error : "User not authenticated"},{status : 400});
        const [row] = await db.query(`select token from share where userId = ? and fileId = ?`,[user.id,fileId]);
        if(row.length === 0) return Response.json({data : []},{status : 200})
        const data = jwt.verify(row[0].token,"yedilmangemore")
        return Response.json({data,token : row[0].token},{status : 200})
    } catch (error) {
        console.log(error);
        
        return Response.json({error : error.message},{status : 500})
    }
}