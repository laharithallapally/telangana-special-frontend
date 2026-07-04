import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const emptyForm = {
  label: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

function AddressManager() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "pincode") {
      value = value.replace(/\D/g, "").slice(0, 6);
    }
    setForm({ ...form, [name]: value });
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
  };

  const openEditForm = (address) => {
    setForm({
      label: address.label,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingId(address.id);
    setShowForm(true);
    setError("");
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const saveAddress = async () => {
    if (!form.label.trim() || !form.addressLine.trim() || !form.city.trim() || !form.state.trim()) {
      setError("Please fill all fields");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Pincode must be 6 digits");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await api.put(`/addresses/${editingId}`, form);
      } else {
        await api.post("/addresses", form);
      }
      await fetchAddresses();
      cancelForm();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await api.delete(`/addresses/${id}`);
      fetchAddresses();
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const setDefault = async (id) => {
    try {
      await api.put(`/addresses/${id}/default`);
      fetchAddresses();
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  if (loading) {
    return (
      <div className="address-manager">
        <p className="address-empty">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="address-manager">
      <div className="address-manager-header">
        <h3>📍 Saved Addresses</h3>
        {!showForm && (
          <button className="add-address-btn" onClick={openAddForm}>
            + Add Address
          </button>
        )}
      </div>

      {showForm && (
        <div className="address-form">
          <input
            className="half"
            type="text"
            name="label"
            placeholder="Label (Home, Work...)"
            value={form.label}
            onChange={handleChange}
          />
          <input
            className="half"
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={6}
          />
          <input
            type="text"
            name="addressLine"
            placeholder="House no, street, area"
            value={form.addressLine}
            onChange={handleChange}
          />
          <input
            className="half"
            type="text"
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <input
            className="half"
            type="text"
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
          />

          {error && (
            <span className="field-error" style={{ gridColumn: "span 2" }}>
              {error}
            </span>
          )}

          <div className="address-form-actions">
            <button className="address-form-save" onClick={saveAddress} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Address" : "Save Address"}
            </button>
            <button className="address-form-cancel" onClick={cancelForm}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="address-empty">No saved addresses yet. Add one to check out faster.</p>
      ) : (
        <div className="address-list">
          {addresses.map((addr) => (
            <div key={addr.id} className={`address-card ${addr.isDefault ? "is-default" : ""}`}>
              <div className="address-card-top">
                <span className="address-label">{addr.label}</span>
                {addr.isDefault && <span className="default-badge">Default</span>}
              </div>
              <div className="address-text">
                {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
              </div>
              <div className="address-actions">
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id)}>Set as default</button>
                )}
                <button onClick={() => openEditForm(addr)}>Edit</button>
                <button className="danger-link" onClick={() => deleteAddress(addr.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressManager;