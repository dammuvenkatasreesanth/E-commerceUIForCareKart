import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../context/AuthContext";
import { useUpdateProfile } from "../../../hooks/useProfile";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editEmail, setEditEmail] = useState(user?.email ?? "");
  const [editSaved, setEditSaved] = useState(false);

  if (!user) return null;

  const handleSaveProfile = () => {
    if (!editName.trim()) return;
    updateProfile.mutate(
      { name: editName.trim(), email: editEmail.trim() },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          setEditSaved(true);
          setTimeout(() => setEditSaved(false), 2500);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/account")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Profile</button>
      <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans'] mb-4">Edit Profile</h2>
      <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
        {/* Avatar */}
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center text-4xl font-extrabold text-white">
            {(editName[0] || user.name?.[0])?.toUpperCase()}
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Full Name <span className="text-destructive">*</span></label>
          <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Your full name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Email <span className="text-muted-foreground font-normal">(optional)</span></label>
          <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="you@example.com" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1">Mobile Number</label>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-muted rounded-xl opacity-60">
            <span className="text-sm">🇮🇳 {user.phone}</span>
            <span className="ml-auto text-[10px] text-muted-foreground">Cannot be changed</span>
          </div>
        </div>
        <button onClick={handleSaveProfile} disabled={!editName.trim() || updateProfile.isPending} className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-40 transition-colors flex items-center justify-center gap-2">
          {editSaved ? <><Check className="w-4 h-4" />Saved!</> : updateProfile.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
