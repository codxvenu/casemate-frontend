import { LoginSchema, RegisterSchema } from "@/schemas/authSchema";
import { Validator } from "@/utility/lib/validator";
import { toast } from "react-toastify";

const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiFetch(url, options) {
  const noRedirect = ["/login", "/register"];
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) {
      if (noRedirect.includes(window.location.pathname)) return;
      toast.error("Session Over");
      return (window.location.href = "/login");
    }
    toast.error(data?.error ?? "something went wrong");
    throw {response : data}
  }
  if (data?.message) toast.success(data?.message);
  return data;
}
const POST = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
const PUT = (body) => ({
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
const FormData = (formData) => ({
  method: "POST",
  body: formData,
});
export const authService = {
  login: async (user) => apiFetch("/api/auth/login", POST({ user })),
  register: (user) => apiFetch("/api/auth/register", POST({ user })),
  forgotPass: ({ email }) => apiFetch("/api/auth/fpass"),
};
export const UserService = {
  getUser: () => apiFetch("/api/auth"),
  getUsers : (data)=> apiFetch(`/api/user/${data}`)
};
export const dashboardService = {
  getStats: () => apiFetch("/api/Dashboard/stats"),
  actionReq: ({ action, id, now, requester_id, sender_id }) =>
    apiFetch(
      "/api/chat/request/actions",
      POST({ action, id, now, requester_id, sender_id })
    ),
  addNotice: ({ ...formData }) =>
    apiFetch("/api/Dashboard/addnotice", POST(formData)),
};
export const FileService = {
  CreateDir: (CurrentFolderId, name) =>
    apiFetch(`${backend}/files/createDir?folderId=${CurrentFolderId}&name=${name}`),
  delete: (fileId) => apiFetch(`${backend}/files/delete?fileId=${fileId}`),
  rename: ({ fileId, newName }) =>
    apiFetch(`${backend}/files/rename?fileId=${fileId}&name=${newName}`),
  share: ({ file, userId }) =>
    apiFetch(`${backend}/Share/`, POST({ file, userId })),
  getFiles: (folderId) => apiFetch(`/api/files?folderId=${folderId}`),
  addFile: (formData) => apiFetch(`${backend}/files/upload`, FormData(formData)),
  getFilePreview: (name) => apiFetch(`${backend}/files/previewFile?folderId=${name}`),
  updateShareStatus : ({fileId,sharetype,filename,allowedUser})=> apiFetch(`${backend}/files/share/`,POST({fileId,sharetype,filename,allowedUser})),
  revokeAccess : (fileId)=> apiFetch(`/api/files/share/access/${fileId}`),
  getShareDetails : (fileId)=> apiFetch(`/api/files/share/${fileId}`),
};
export const ChatBotService = {
  getChatById: (id) => apiFetch(`/api/chatbot/${id}`),
  getChatHistory: () => apiFetch(`/api/chatbot/search/history`),
  createChat: ({ created_at, index }) =>
    apiFetch(`/api/newchat`, POST({ created_at, index })),
  getConversations: (conversations_ids) =>
    apiFetch(`/api/chat/messages/`, POST({ conversations_ids })),
  getChat: () => apiFetch(`/api/chat/`),
  shareMessage: (id) => apiFetch(`/api/share/${id}`),
  searchChat: (query) => apiFetch(`/api/chatbot/search/${query}`),
  addSearchHistroy: ({ query }) =>
    apiFetch("/api/chatbot/search/history", POST({ query })),
};
export const ChatService = {
  searchChat: (query) => apiFetch(`/api/chat/search/${query}`),
  sendRequest: ({ requester_id, created_at, receiver_id }) =>
    apiFetch(
      "/api/chat/request",
      POST({ requester_id, created_at, receiver_id })
    ),
};
