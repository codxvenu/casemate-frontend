import { authMiddleware } from "../../middleware/auth"
import db from "@/lib/db";
export async function GET(req,{params}) {
    try { 
        const user = await authMiddleware();
        if(!user) return Response.json({error :"User not authenticated"},{status : 401})
        const {userDetails} = await params
        const [rows] = await db.query("select id,avatar,name,email from users where id = ? or email LIKE ? ",[!Number(userDetails) ? 0 : Number(userDetails),`%${userDetails}%`])
        return Response.json({users : rows },{status : 200})
    } catch (error) {
        console.log(error);
        return Response.json({error : error.message },{status : 400})
    }
    
}