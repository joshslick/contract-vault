import React from 'react';

export default function AddContractCard({
  form,
  setForm,
  dynamicFields,
  categories,
  onSave,
}) {
  return (
    <div className="card">
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>Add Contract</h3>

      <form onSubmit={onSave}>
        <input
          className="vault-input"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <input
          className="vault-input"
          placeholder="Provider"
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
        />

        <input
          className="vault-input"
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />

        <select
          className="vault-input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Type</option>
          {categories.filter((c) => c !== 'All').map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Dynamic fields */}
        {dynamicFields?.length > 0 && (
          <div>
            {dynamicFields.map((f) => {
              const isDate = f.type === 'date';
              const placeholder = isDate && f.hint ? `mm/dd/yyyy ${f.hint}` : f.label;

              return (
                <input
                  key={f.key}
                  className="vault-input"
                  type={isDate ? 'text' : f.type}
                  placeholder={placeholder}
                  value={form[f.key] || ''}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={!!f.required}
                />
              );
            })}
          </div>
        )}

        <textarea
          className="vault-input"
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />

        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  );
}
