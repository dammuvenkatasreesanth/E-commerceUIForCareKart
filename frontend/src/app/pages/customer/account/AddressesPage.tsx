import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAddresses, useCreateAddress, useDeleteAddress, useSetDefaultAddress } from "../../../hooks/useAddresses";
import { usePincodeAutofill } from "../../../hooks/usePincodeAutofill";
import { isValidPhone, isValidPincode, mapsUrlForAddress } from "../../../lib/addressValidation";

export function AddressesPage() {
  const navigate = useNavigate();
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const setDefaultAddress = useSetDefaultAddress();
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Home", name: "", line1: "", pin: "", city: "", state: "", phone: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const { isLoading: isLookingUpPincode } = usePincodeAutofill(newAddr.pin, (city, state) => {
    setNewAddr((a) => ({ ...a, city, state }));
  });

  const phoneValid = newAddr.phone === "" || isValidPhone(newAddr.phone);
  const pincodeValid = newAddr.pin === "" || isValidPincode(newAddr.pin);

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
    setTouched({ name: true, line1: true, pin: true, phone: true });
    if (!newAddr.name || !newAddr.line1) return;
    if (!isValidPincode(newAddr.pin)) { toast.error("Enter a valid 6-digit pincode"); return; }
    if (!isValidPhone(newAddr.phone)) { toast.error("Enter a valid 10-digit mobile number"); return; }
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
          setNewAddr({ label: "Home", name: "", line1: "", pin: "", city: "", state: "", phone: "" });
          setTouched({});
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
              <a
                href={mapsUrlForAddress(addr)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                <MapPin className="w-3 h-3" />View on map
              </a>
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
            <div>
              <label className="block text-xs font-semibold mb-1">Full Name</label>
              <input value={newAddr.name} onChange={e => setNewAddr(a => ({ ...a, name: e.target.value }))} placeholder="Recipient name" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Address</label>
              <input value={newAddr.line1} onChange={e => setNewAddr(a => ({ ...a, line1: e.target.value }))} placeholder="Flat, Street, Area" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Phone</label>
                <input
                  value={newAddr.phone}
                  onChange={e => setNewAddr(a => ({ ...a, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                  onBlur={() => setTouched(t => ({ ...t, phone: true }))}
                  placeholder="9876543210"
                  inputMode="numeric"
                  className={`w-full px-3 py-2.5 bg-muted rounded-xl border focus:outline-none text-sm ${touched.phone && !phoneValid ? "border-destructive" : "border-transparent focus:border-primary/40"}`}
                />
                {touched.phone && !phoneValid && <p className="text-[11px] text-destructive mt-1">Enter a valid 10-digit mobile number</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">PIN Code</label>
                <div className="relative">
                  <input
                    value={newAddr.pin}
                    onChange={e => setNewAddr(a => ({ ...a, pin: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
                    onBlur={() => setTouched(t => ({ ...t, pin: true }))}
                    placeholder="400001"
                    inputMode="numeric"
                    className={`w-full px-3 py-2.5 bg-muted rounded-xl border focus:outline-none text-sm ${touched.pin && !pincodeValid ? "border-destructive" : "border-transparent focus:border-primary/40"}`}
                  />
                  {isLookingUpPincode && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">Looking up…</span>}
                </div>
                {touched.pin && !pincodeValid && <p className="text-[11px] text-destructive mt-1">Enter a valid 6-digit pincode</p>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">State</label>
              <input value={newAddr.state} onChange={e => setNewAddr(a => ({ ...a, state: e.target.value }))} placeholder="Maharashtra" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">City</label>
              <input value={newAddr.city} onChange={e => setNewAddr(a => ({ ...a, city: e.target.value }))} placeholder="Mumbai" className="w-full px-3 py-2.5 bg-muted rounded-xl border border-transparent focus:border-primary/40 focus:outline-none text-sm" />
            </div>
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
