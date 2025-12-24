export function handleSize(i){
      const size = (i/1024).toFixed(2)
      if(size < 1000) return `${(i/1024).toFixed(2)} KB`
      return `${(size/1024).toFixed(2)} MB`
    }
export function parseFileName(filename){
  const name = filename.split(".").reduce((i,acc)=>i+acc)
  const ext = filename.split(".").at(-1)

  return {name,ext}
}
export function FileAllowed(ext){
  if(allowedExt.includes(ext)) return true
  return false
}
//screen.recording.v1.mp4