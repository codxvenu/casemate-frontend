import { Copy, FilePen, Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Loader from '../loader'
import { inter } from '@/app/layout'
import Image from 'next/image'
import { FileService, UserService } from '@/hook/apifetch'
import { handleCopyClipBoard } from '@/utility/lib/Copy'

const ShareD = ({setShareShow,fileId,filename}) => {
    const[newName,setNewName] = useState("")
    const[sharetype,setSharetype] = useState(null)
    const[allowedUser,setAllowedUser] = useState([])
    const [listUsers,setListUsers] = useState(false)
    const [loading,setLoading] = useState(false)
    const [search,setSearch] = useState(null)
    const [selectedUsers,setSelectedUsers] = useState([])
    const [url,setUrl] = useState("")
    const [token,setToken] = useState("")

    useEffect(()=>{getShareDetails()},[])
    useEffect(()=>{
      const timer2 = setTimeout(() => {
        searchUser(search);
      }, 2000);
      return ()=>clearTimeout(timer2)
    },[search])
    useEffect(()=>{
      if(!fileId || !filename) return
      console.log(sharetype,fileId);
      
      if(sharetype === "private"){
        setToken("")
        setUrl("")
        revokeAccess()
      }
      if(!token) handleShare()
    },[sharetype])
    async function getShareDetails() {
      const res = await FileService.getShareDetails(fileId)
      if(!res?.data) return
      setToken(res?.token || "")
      setUrl(process.env.NEXT_PUBLIC_BACKEND_URL+`/files/guest?token=${res?.token}` || "")
      setAllowedUser(res?.data?.allowedUsers || [])
      setSharetype(res?.data?.mode || "private")
    }
     async function revokeAccess(){
        if(sharetype !== "private")  return 
        await FileService.revokeAccess(fileId)
      return 
      }
    async function searchUser(search) {
      if(!search) return
      const res = await UserService.getUsers(search)
      setListUsers(res?.users ?? [])
    }
  async function handleShare(){
    if(!["public","guest"].includes(sharetype)) return
    setUrl("Loading...")
    const res = await FileService.updateShareStatus({fileId,sharetype,filename,allowedUser});
    if(res?.url) setUrl(res?.url)
    setLoading(false);
    }
  return (
     <>
       <div className='fixed backdrop-blur-[2px] bg-[rgba(0,0,0,.7)] inset-0  w-screen h-screen ' onClick={()=>setShareShow(false)}></div> 
      <div className={`fixed top-1/2 left-1/2 -translate-1/2 flex flex-col justify-between items-start z-[100000] aspect-auto w-[450px] bg-white text-text p-4 rounded-md gap-2 shadow-md ${inter.className}`}>
      <span className='block relative w-full'>
      <X className='w-4 h-4 text-neutral-800 absolute top-2 right-2'/>
       <h2 className='font-semibold'>Share file access</h2>
       <small className='text-(--muted-forground)'>Share this file access to other users.</small>
      </span>
       <hr className='text-neutral-400 w-full my-0'/>
      <div className='text-[13px] w-full py-2 flex items-center justify-between'>
        <h3 className='text-neutral-600'>Choose Share Option</h3>
        <select name="sharetype" value={sharetype || ""} className='outline-0 border-[1px] rounded-sm py-1 px-2 border-gray-400' id="" onChange={(e)=>setSharetype(e.target.value)}>
          <option value="private">
            Private
          </option>
          <option value="public">
            anyone with link
          </option>
          <option value="guest">
            Allowed access only
          </option>
        </select>
      </div>
     {sharetype==="public" && <>
       <hr className='text-neutral-400 w-full mb-2'/>
     <span className='flex flex-col gap-2 w-full  '>
        <h3>Share with link</h3>
        <label htmlFor="url" className='relative w-full border-[1px] border-neutral-400 shadow-sm rounded-sm p-1'>
        <input name='url' type="text" disabled value={url || ""} className='text-[13px] font-normal w-[96%] text-(--text) px-2 text-ellipsis whitespace-nowrap'/>
    <Copy className='absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 text-(--muted-forground) hover:text-(--text)' onClick={()=>handleCopyClipBoard(url)}/>
        </label>
       </span>
     </>
       }
      { sharetype==="guest" &&
      <>
      <hr className='text-neutral-400 w-full mb-2'/>
      <div className='flex flex-col w-full gap-3'>
        <label htmlFor="url" className='relative w-full border-[1px] border-neutral-400 shadow-sm rounded-sm p-1'>
        <input name='url' type="text" placeholder='Search user' value={search || ""} className='text-[13px] font-normal w-[90%] text-(--text) outline-0 px-2' onChange={(e)=>setSearch(e.target.value || "")}/>
    <Search className='absolute top-1/2 -translate-y-1/2 right-2 w-4 h-4 text-blue-600'/>
        </label>
        <div className={`${!!search?.trim().length && "hidden"}`}>
          <h3 className='text-[13px]!'>Allowed Users</h3>
          <ul className='flex flex-col gap-1 py-2 text-center min-h-14 justify-center'>
            {!!allowedUser?.length && allowedUser.map((u)=>(
            <li key={u.id} className='p-2 flex items-center gap-2 bg-gray-100 w-full rounded-md'>
            <Image src={u?.avatar} width={30} height={30} alt='img' className='rounded-full'/>
            <span className='flex flex-col '>
              <h3 className='text-[12px]!'>{u?.name}</h3>
              <small className='text-xs text-(--muted-forground)'>{u?.email}</small>
            </span>
            <span className='w-full flex justify-end'><X className='w-4 h-4 text-(--muted-forground) hover:scale-110 hover:text-(--text) transition-all ease-in-out duration-200'/></span>
            </li>
            ))}
            {!allowedUser?.length && <small className='block text-center w-full'>No active user</small>}
            </ul>
        </div>
        <div className={`${!search?.trim().length && "hidden"} `}>
          <h3 className='text-[13px]!'>Select Users</h3>
          <div className='h-[218px] overflow-y-scroll py-2' style={{scrollbarWidth : "thin"}}>
          <ul className='flex flex-col gap-1 py-2 text-start min-h-14 justify-start max-h-max'>
            {!!listUsers?.length && listUsers.map((u)=>(
            <li key={u.id} className={`${selectedUsers?.includes(u.id) && "bg-neutral-100"} p-2 flex items-center gap-2 hover:bg-neutral-100 w-full rounded-md`} onClick={()=>setSelectedUsers((prev)=>prev.includes(u.id) ? prev.filter(i=>i !== u.id) : [...prev,u.id])}>
            <Image src={u?.avatar} width={30} height={30} alt='img' className='rounded-full'/>
            <span className='flex flex-col '>
              <h3 className='text-[12px]!'>{u?.name}</h3>
              <small className='text-xs text-(--muted-forground)'>{u?.email}</small>
            </span>
            <span className={`w-full flex justify-end ${!allowedUser?.find((i)=>i.id === u.id) && "hidden"}`}><X className='w-4 h-4 text-(--muted-forground) hover:scale-110 hover:text-red-500 transition-all ease-in-out duration-200'/></span>
            </li>
            ))}
            {!listUsers?.length && <small className='block text-center'>No user found</small>}
            </ul>
          </div>
            <button className={`w-full bg-blue-600 text-white text-sm py-2 rounded-md mt-2 ${loading || !selectedUsers?.length && "bg-blue-400!"}`} disabled={loading || false} onClick={()=>handleShare()}>{loading ? <span className='flex items-center justify-center gap-1'><Loader className={"!fill-blue-500 w-6 h-6"}/>Processing</span> : selectedUsers?.length ? `Send invite ${selectedUsers?.length}` : "Select users to invite"}</button>
        </div>
       </div>
      </> 
       }
      </div>
       </>
  )
}

export default ShareD;

