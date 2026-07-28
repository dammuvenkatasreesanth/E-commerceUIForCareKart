import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAddresses, useCreateAddress, useDeleteAddress, useSetDefaultAddress } from "../../../hooks/useAddresses";

export function AddressesPage() {
  const navigate = useNavigate();
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Home", name: "", line1: "", city: "", state: "", pin: "", phone: "" });

  const handleSetDefault = (id: number) => {
    setDefaultAddress.mutate(id, {
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleDelete = (id: number) => {
    deleteAddress.mutate(id, {
      onError: (err: Error) => toast.error(err.message),
    });
  };

  const handleSave = () => {
    if (!newAddr.name || !newAddr.line1) return;
    createAddress.mutate(
      {
        label: newAddr.label,
        name: newAddr.name,
        line1: newAddr.line1,
        city: newAddr.city,
        state: newAddr.state,
        pincode: newAddr.pin,
        phone: newAddr.phone,
      },
      {
        onSuccess: () => {
          toast.success("Address saved");
          setNewAddr({ label: "Home", name: "", line1: "", city: "", state: "", pin: "", phone: "" });
          setShowAddAddr(false);
        },
        onError: (err: Error) => toast.error(err.message),
      },
    );
  };

  return (
    <div>
      <button onClick={() => navigate("/account")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5"><ArrowLeft className="w-4 h-4" />Back to Profile</button>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold font-['Plus_Jakarta_Sans']">Saved Addresses</h2>
        <button onClick={() => setShowAddAddr(true)} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white text-xs font-bold rounded-xl"><Plus className="w-3.5 h-3.5" />Add New</button>
      </div>
      {isLoading && <div className="text-center py-10 text-muted-foreground bg-white border border-border rounded-2xl">Loading addresses...</div>}
      {!isLoading && (
        <div className="space-y-3">
          {(addresses ?? []).map(addr => (
            <div key={addr.id} className={`bg-white border-2 rounded-2xl p-4 transition-all ${addr.isDefault ? "border-primary" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-extrabold bg-muted px-2 py-0.5 rounded-lg">{addr.label}</span>
                  {addr.isDefault && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!addr.isDefault && <button onClick={() => handleSetDefault(addr.id)} className="text-[10px] font-semibold text-primary hover:underline px-2 py-1">Set Default</button>}
                  <button onClick={() => handleDelete(addr.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="font-semibold text-sm">{addr.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{addr.line1}</p>
              <p className="text-xs text-muted-foreground">{addr.city}, {addr.state} — {addr.pincode}</p>
              <p className="text-xs text-muted-foreground mt-0.5">📞 +91 {addr.phone}</p>
            </div>
          ))}
          {(addresses ?? []).length === 0 && <div className="text-center py-10 text-muted-foreground bg-white border border-border rounded-2xl"><MapPin className="w-10 h-10 mx-auto mb-2 text-border" /><p>No saved addresses</p></div>}
        </div>
      )}
      {/* Add address form */}
      {showAddAddr && (
        <div className="mt-4 bg-white border-2 border-primary rounded-2xl p-5">
          <h3 className="font-bold text-sm mb-4">New Address</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {["Home", "Office", "Other"].map(l => <button key={l} onClick={() => setNewAddr(a => ({ ...a, label: l }))} className={`px-3 py-1.5 text-xs font-semibold rounded-xl border-2 transition-all ${newAddr.label === l ? "border-primary bg-primary/5 text-primary" : "border-border"}`}>{l}</button>)}
            </div>
            {[{ k: "name", label: "Full Name", ph: "Recipient name" }, { k: "line1", label: "Address", ph: "Flat, Street, Area" }, { k: "city", label: "City", ph: "Mumbai" }, { k: "state", label: "State", ph: "Maharashtra" }, { k: "pin", label: "PIN Code", ph: "400001" }, { k: "phone", label: "Phone", ph: "9876543210" }].map(f => (
              <div key={f.k}><label className="block text-xs font-semibold mb-1">{f.label}</label><input value={(newAddr as Record<string, string>)[f.k]} onChange={e => setNewAddr(a => ({ ...a, [f.k]: e.target.value }))} placeholder={f.ph} className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" /></div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleSave} disabled={createAddress.isPending} className="flex-1 py-2.5 bg-primary text-white text-sm font-bold rounded-xl disabled:opacity-40">{createAddress.isPending ? "Saving..." : "Save Address"}</button>
            <button onClick={() => setShowAddAddr(false)} className="px-4 py-2.5 bg-muted text-muted-foreground text-sm font-semibold rounded-xl">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
