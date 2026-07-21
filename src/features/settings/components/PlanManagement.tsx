import { useState } from 'react'
import { Plus, Edit2, CheckCircle2, XCircle } from 'lucide-react'
import { useMockDbStore } from '@/lib/mock-db'
import type { MembershipPlan } from '@/types'

const INITIAL_FORM_STATE = {
  name: '',
  duration_days: 30,
  price: 1500,
  description: '',
  max_freeze_days: 7,
  is_active: true
}

export function PlanManagement() {
  const plans = useMockDbStore((state) => state.plans)
  const addPlan = useMockDbStore((state) => state.addPlan)
  const updatePlan = useMockDbStore((state) => state.updatePlan)

  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE)
    setIsEditing(false)
    setEditingId(null)
  }

  const handleEdit = (plan: MembershipPlan) => {
    setFormData({
      name: plan.name,
      duration_days: plan.duration_days,
      price: plan.price,
      description: plan.description || '',
      max_freeze_days: plan.max_freeze_days,
      is_active: plan.is_active
    })
    setEditingId(plan.id)
    setIsEditing(true)
  }

  const handleToggleActive = (plan: MembershipPlan) => {
    updatePlan({ ...plan, is_active: !plan.is_active, updated_at: new Date().toISOString() })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) return

    if (editingId) {
      const existing = plans.find(p => p.id === editingId)
      if (existing) {
        updatePlan({
          ...existing,
          ...formData,
          updated_at: new Date().toISOString()
        })
      }
    } else {
      const newPlan: MembershipPlan = {
        id: `plan_${Date.now()}`,
        tenant_id: 'tenant_001',
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null
      }
      addPlan(newPlan)
    }
    
    resetForm()
  }

  return (
    <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-secondary)', paddingBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Membership Plans</h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Manage the subscription plans you offer to your members</p>
        </div>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            <Plus size={16} />
            New Plan
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem' }}>{editingId ? 'Edit Plan' : 'Create New Plan'}</h3>
          <div className="grid-2">
            <div className="form-group">
              <label htmlFor="plan-name" className="form-label form-label-required">Plan Name</label>
              <input id="plan-name" required className="form-input" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. 6 Month Premium" />
            </div>
            <div className="form-group">
              <label htmlFor="plan-duration" className="form-label form-label-required">Duration (Days)</label>
              <input id="plan-duration" required type="number" min="1" className="form-input" value={formData.duration_days} onChange={e => setFormData(p => ({ ...p, duration_days: parseInt(e.target.value) || 30 }))} />
            </div>
            <div className="form-group">
              <label htmlFor="plan-price" className="form-label form-label-required">Price (₹)</label>
              <input id="plan-price" required type="number" min="0" className="form-input" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="form-group">
              <label htmlFor="plan-freeze" className="form-label">Max Freeze Days</label>
              <input id="plan-freeze" type="number" min="0" className="form-input" value={formData.max_freeze_days} onChange={e => setFormData(p => ({ ...p, max_freeze_days: parseInt(e.target.value) || 0 }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="plan-description" className="form-label">Description (Optional)</label>
              <input id="plan-description" className="form-input" value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Benefits of this plan..." />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            <button type="submit" className="btn btn-primary">{editingId ? 'Save Changes' : 'Create Plan'}</button>
          </div>
        </form>
      ) : null}

      <div className="table-responsive">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} style={{ opacity: plan.is_active ? 1 : 0.6 }}>
                <td style={{ fontWeight: 500 }}>{plan.name}</td>
                <td>{plan.duration_days} Days</td>
                <td>₹{plan.price.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${plan.is_active ? 'badge-active' : 'badge-inactive'}`}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="text-right">
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button onClick={() => handleEdit(plan)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} title="Edit Plan">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleToggleActive(plan)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: plan.is_active ? 'var(--warning-500)' : 'var(--success-500)' }} title={plan.is_active ? 'Deactivate Plan' : 'Activate Plan'}>
                      {plan.is_active ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center" style={{ padding: '2rem', color: 'var(--text-secondary)' }}>
                  No plans configured yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
