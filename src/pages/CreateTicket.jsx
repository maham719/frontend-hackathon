import { useEffect, useState } from "react";
import { Bold, Italic, List, Paperclip, Send, Sparkles, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useTicket } from "../features/tickets/context/TicketContext.jsx";
const initialForm = {
  subject: "",
  category: "",
  urgency: "Normal - Standard request",
  description: "",
};

const CreateTicket = ({ onClose }) => {
  const { theme } = useTheme();
  const { createTicket } = useTicket();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const field = isDark
    ? "border-[#2d3548] bg-[#171c29] text-[#f3ebff] placeholder:text-[#737b91] focus:border-[#9b5ce7]"
    : "border-[#ded2ef] bg-[#fbf8ff] text-[#201d2c] placeholder:text-[#8b819a] focus:border-[#8d5fe5]";
  const muted = isDark ? "text-[#9fa9c5]" : "text-[#6c687d]";
  const heading = isDark ? "text-[#f8f0ff]" : "text-[#201d2c]";

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  setIsSubmitting(true);

  const result = await createTicket({
    subject: form.subject,
    description: form.description,
    customerCategory: form.category,
    customerUrgency: form.urgency,
  });

  if (result.success) {
    onClose();
  } else {
    console.error("Create Ticket Failed:", result.message);
  }

  setIsSubmitting(false);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#080a11]/75 p-4 backdrop-blur-sm sm:p-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <form onSubmit={handleSubmit} className={`my-auto w-full max-w-[584px] rounded-[10px] border p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:p-7 ${isDark ? "border-[#293449] bg-[#111521]" : "border-[#e4d8f4] bg-[#f8f3ff]"}`}>
        <div className={`mb-5 flex items-start justify-between border-b pb-5 ${isDark ? "border-[#252b3c]" : "border-[#e8def4]"}`}>
          <div>
            <h2 className={`flex items-center gap-2 text-[1.6rem] font-bold tracking-[-0.04em] ${heading}`}><Sparkles size={22} className="text-[#a995ff]" />Create Ticket</h2>
            <p className={`mt-1 max-w-[480px] text-xs leading-5 ${muted}`}>Describe your issue below. SupportFlow AI will automatically analyze your request for faster resolution and intelligent routing.</p>
          </div>
          <button type="button" aria-label="Close create ticket" onClick={onClose} className={`rounded-lg p-1 transition-colors ${muted} hover:bg-[#ffffff0d]`}><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <label className={`block text-[10px] font-bold uppercase tracking-[0.1em] ${muted}`}>Subject
            <input required name="subject" value={form.subject} onChange={updateField} placeholder="Brief summary of the issue..." className={`mt-2 w-full rounded-md border px-3 py-3 text-sm outline-none transition-colors ${field}`} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={`block text-[10px] font-bold uppercase tracking-[0.1em] ${muted}`}>Category
              <select required name="category" value={form.category} onChange={updateField} className={`mt-2 w-full rounded-md border px-3 py-3 text-sm outline-none transition-colors ${field}`}>
                <option value="" disabled>Select a category</option>
                <option value="billing">Billing</option>
<option value="technical">Technical</option>
<option value="account">Account</option>
<option value="general">General</option>
              </select>
            </label>
            <label className={`block text-[10px] font-bold uppercase tracking-[0.1em] ${muted}`}>Urgency
              <select name="urgency" value={form.urgency} onChange={updateField} className={`mt-2 w-full rounded-md border px-3 py-3 text-sm outline-none transition-colors ${field}`}>
               <option value="low">Low - Can wait</option>
<option value="medium">Normal - Standard request</option>
<option value="high">High - Needs attention</option>
<option value="urgent">Critical - Blocking issue</option>
              </select>
            </label>
          </div>
          <label className={`block text-[10px] font-bold uppercase tracking-[0.1em] ${muted}`}>Description
            <span className="float-right normal-case font-medium tracking-normal text-[#737b91]"><Sparkles size={11} className="mr-1 inline" />AI will parse this text</span>
            <div className={`mt-2 overflow-hidden rounded-md border ${field}`}>
              <div className={`flex gap-4 border-b px-3 py-2.5 ${isDark ? "border-[#2d3548]" : "border-[#ded2ef]"}`}>
                <button type="button" aria-label="Bold" className={muted}><Bold size={14} /></button><button type="button" aria-label="Italic" className={muted}><Italic size={14} /></button><button type="button" aria-label="Bulleted list" className={muted}><List size={15} /></button><button type="button" aria-label="Attach file" className={muted}><Paperclip size={14} /></button>
              </div>
              <textarea required name="description" value={form.description} onChange={updateField} rows="5" placeholder="Provide as much detail as possible. Error codes, steps to reproduce, or recent changes are very helpful..." className="block w-full resize-none bg-transparent px-3 py-3 text-sm leading-5 outline-none" />
            </div>
          </label>
        </div>

        <div className="mt-7 flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <span className={`rounded-full border px-3 py-2 text-[11px] font-medium ${isDark ? "border-[#282d42] bg-[#171b2a]" : "border-[#e5dced] bg-[#f1eafa]"} ${muted}`}><Sparkles size={12} className="mr-1 inline text-[#6f8cff]" />Secure AI Processing</span>
          <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className={`rounded-md border px-4 py-2.5 text-sm font-semibold ${isDark ? "border-[#2d3548] bg-[#1b2030] text-[#d9d4e3] hover:bg-[#242a3b]" : "border-[#ded2ef] bg-[#f1eafa] text-[#4e475a] hover:bg-[#e9def6]"}`}>Cancel</button>
          <button
  type="submit"
  disabled={isSubmitting}
  className={`flex items-center justify-center gap-2 rounded-md bg-gradient-to-r from-[#8d72f7] to-[#6520ca] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_22px_rgba(101,32,202,0.3)] hover:brightness-110 ${
    isSubmitting
      ? "cursor-not-allowed opacity-70"
      : ""
  }`}
>
  {isSubmitting ? (
    <>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      Submitting...
    </>
  ) : (
    <>
      Submit Ticket
      <Send size={16} />
    </>
  )}
</button></div>
        </div>
      </form>
    </div>
  );
};

export default CreateTicket;
