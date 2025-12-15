import db, { getUserbyEmail } from "@/lib/db"
import { authMiddleware } from "../middleware/auth"

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const folderId = searchParams.get("folderId");
    
    const user = await authMiddleware()
    if(!user) return Response.json({error : "User not authenticated"},{status : 400});
    const [files] = await db.query(`select * from files where userId = ? and ${folderId !== "null"? "folderId = ?" :"folderId is null"}`,[user.id,folderId]);
    const [folder] = await db.query("select * from folder where userId = ? and parentId = ?",[user.id,folderId]);
    console.log(files,"files");
    
    if(files.length == 0 && folder.length == 0) return Response.json({error : "no file found"},{status : 200})
    return Response.json({files},{status : 200})
}