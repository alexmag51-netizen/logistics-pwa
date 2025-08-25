import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Order = {
  id: string
  date: string
  slot: string
  address: string
  price: number | null
  status: 'new' | 'in_progress' | 'done' | 'moved'
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0,10))
  const [slot, setSlot] = useState('10:00')
  const [address, setAddress] = useState('Тестовый адрес')

  async function fetchOrders() {
    setLoading(true); setError(null)
    const { data, error } = await supabase
      .from('orders')
      .select('id,date,slot,address,price,status')
      .order('date', { ascending: true })
      .order('slot', { ascending: true })
    if (error) setError(error.message)
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  async function addOrder() {
    const { error } = await supabase.from('orders').insert({
      date, slot, address, price: 200, status: 'new', source: 'self'
    })
    if (error) return alert('Ошибка: ' + error.message)
    setAddress('Тестовый адрес')
    await fetchOrders()
  }

  return (
    <div style={{maxWidth: 720, margin: '24px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'}}>
      <h1>Заказы</h1>

      <div style={{display:'grid', gap:8, gridTemplateColumns:'1fr 1fr 2fr auto', alignItems:'end', marginBottom:16}}>
        <div>
          <label>Дата<br/>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
          </label>
        </div>
        <div>
          <label>Слот<br/>
            <input type="time" value={slot} onChange={e=>setSlot(e.target.value)} step={60*60} />
          </label>
        </div>
        <div>
          <label>Адрес<br/>
            <input type="text" value={address} onChange={e=>setAddress(e.target.value)} />
          </label>
        </div>
        <button onClick={addOrder}>Добавить</button>
      </div>

      {loading ? <p>Загрузка…</p> : error ? <p style={{color:'crimson'}}>Ошибка: {error}</p> : (
        <ul style={{listStyle:'none', padding:0, margin:0}}>
          {orders.map(o => (
            <li key={o.id} style={{padding:12, border:'1px solid #e5e7eb', borderRadius:12, marginBottom:8, display:'grid', gridTemplateColumns:'110px 90px 1fr 100px', gap:8, alignItems:'center'}}>
              <span>{o.date}</span>
              <span>{o.slot}</span>
              <div>
                <div style={{fontWeight:600}}>{o.address}</div>
                <div style={{opacity:.7, fontSize:13}}>статус: {o.status}</div>
              </div>
              <div style={{textAlign:'right'}}>{o.price ?? '-'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
