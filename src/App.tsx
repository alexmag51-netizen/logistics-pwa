import * as React from 'react'
import { View, FlatList } from 'react-native'
import {
  Provider as PaperProvider,
  Appbar,
  FAB,
  Card,
  Text,
  Menu,
  Portal,
  Dialog,
  Button,
  TextInput,
  SegmentedButtons
} from 'react-native-paper'
import {
  ClipboardList,
  Map as MapIcon,
  Settings as SettingsIcon,
  User,
  LogOut,
  Truck,
  Phone,
  Check,
  MoreVertical,
  Plus,
  Trash2
} from 'lucide-react'
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { theme } from './theme'

// адаптер: иконка lucide → IconSource для Paper
const IconFn =
  (Comp: React.ComponentType<any>) =>
  ({ color, size }: { color: string; size: number }) =>
    <Comp color={color} size={size} />

function LeftIconAvatar({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(14,165,233,0.12)'
      }}
    >
      {children}
    </View>
  )
}

function OrdersScreen() {
  const [menuVisible, setMenuVisible] = React.useState(false)

  // список
  const [orders, setOrders] = React.useState<
    { id: string; date: string; time: string; address: string; status: 'new' | 'in_progress' | 'done' }[]
  >([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // диалог создания
  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [addOpen, setAddOpen] = React.useState(false)
  const [form, setForm] = React.useState({
    date: today,
    time: '10:00',
    address: '',
    price: '200', // строка для TextInput
    status: 'new' as 'new' | 'in_progress' | 'done'
  })
  const [submitting, setSubmitting] = React.useState(false)

  // диалог удаления
  const [delOpen, setDelOpen] = React.useState<{ open: boolean; id: string | null }>({ open: false, id: null })
  const [deleting, setDeleting] = React.useState(false)

  async function fetchOrders() {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, date, slot, address, status')
        .order('date', { ascending: true })
        .order('slot', { ascending: true })
      if (error) throw error
      setOrders(
        (data || []).map((o: any) => ({
          id: o.id,
          date: o.date,
          time: o.slot,
          address: o.address,
          status: o.status
        }))
      )
    } catch (e: any) {
      console.error('fetchOrders error:', e)
      setError(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchOrders()
  }, [])

  async function addOrderSubmit() {
    setSubmitting(true)
    try {
      const priceNum = form.price.trim() ? Number(form.price) : null
      const { error } = await supabase.from('orders').insert({
        date: form.date,
        slot: form.time,
        address: form.address || '—',
        price: Number.isFinite(priceNum as number) ? priceNum : null,
        status: form.status,
        source: 'self'
      })
      if (error) throw error
      setAddOpen(false)
      setForm({ date: today, time: '10:00', address: '', price: '200', status: 'new' })
      await fetchOrders()
    } catch (e: any) {
      console.error('addOrder error:', e)
      alert('Ошибка: ' + (e?.message ?? String(e)))
    } finally {
      setSubmitting(false)
    }
  }

  async function confirmDelete() {
    if (!delOpen.id) return
    setDeleting(true)
    try {
      const { error } = await supabase.from('orders').delete().eq('id', delOpen.id)
      if (error) throw error
      setDelOpen({ open: false, id: null })
      await fetchOrders()
    } catch (e: any) {
      console.error('delete error:', e)
      alert('Ошибка: ' + (e?.message ?? String(e)))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Logistics PWA" subtitle="Заказы" />
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={<Appbar.Action icon={IconFn(MoreVertical)} onPress={() => setMenuVisible(true)} />}
        >
          <Menu.Item onPress={() => {}} leadingIcon={IconFn(User)} title="Профиль" />
          <Menu.Item onPress={() => {}} leadingIcon={IconFn(SettingsIcon)} title="Настройки" />
          <Menu.Item onPress={() => {}} leadingIcon={IconFn(LogOut)} title="Выйти" />
        </Menu>
      </Appbar.Header>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text variant="bodyMedium">Загрузка…</Text>
        </View>
      ) : error ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: 'crimson' }}>Ошибка: {error}</Text>
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, gap: 12 as any }}
          data={orders}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => (
            <Card mode="elevated">
              <Card.Title
                title={item.address}
                subtitle={`статус: ${item.status}`}
                left={() => (
                  <LeftIconAvatar>
                    <Truck size={22} />
                  </LeftIconAvatar>
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  {item.date} • {item.time}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Appbar.Action icon={IconFn(MapIcon)} onPress={() => {}} />
                <Appbar.Action icon={IconFn(Phone)} onPress={() => {}} />
                <Appbar.Action
                  icon={IconFn(Trash2)}
                  color="#dc2626"
                  onPress={() => setDelOpen({ open: true, id: item.id })}
                  accessibilityLabel="Удалить"
                />
              </Card.Actions>
            </Card>
          )}
        />
      )}

      {/* FAB → открыть диалог создания */}
      <FAB icon={IconFn(Plus)} style={{ position: 'absolute', right: 20, bottom: 76 }} onPress={() => setAddOpen(true)} label="Новый" />

      {/* Диалоги */}
      <Portal>
        {/* Добавление */}
        <Dialog visible={addOpen} onDismiss={() => setAddOpen(false)}>
          <Dialog.Title>Новая заявка</Dialog.Title>
          <Dialog.Content>
            <View style={{ gap: 12 as any }}>
              <TextInput label="Дата (YYYY-MM-DD)" value={form.date} onChangeText={(v) => setForm((f) => ({ ...f, date: v }))} />
              <TextInput label="Время (HH:MM)" value={form.time} onChangeText={(v) => setForm((f) => ({ ...f, time: v }))} />
              <TextInput label="Адрес" value={form.address} onChangeText={(v) => setForm((f) => ({ ...f, address: v }))} />
              <TextInput label="Цена" value={form.price} onChangeText={(v) => setForm((f) => ({ ...f, price: v }))} keyboardType="numeric" />
              <SegmentedButtons
                value={form.status}
                onValueChange={(v) => setForm((f) => ({ ...f, status: v as any }))}
                buttons={[
                  { value: 'new', label: 'Новая' },
                  { value: 'in_progress', label: 'В работе' },
                  { value: 'done', label: 'Готово' }
                ]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setAddOpen(false)}>Отмена</Button>
            <Button loading={submitting} onPress={addOrderSubmit}>
              Сохранить
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Удаление */}
        <Dialog visible={delOpen.open} onDismiss={() => setDelOpen({ open: false, id: null })}>
          <Dialog.Title>Удалить заявку?</Dialog.Title>
          <Dialog.Content>
            <Text>Действие необратимо.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDelOpen({ open: false, id: null })}>Отмена</Button>
            <Button loading={deleting} textColor="#dc2626" onPress={confirmDelete}>
              Удалить
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

function MapScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Карта" />
      </Appbar.Header>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text variant="titleMedium">Здесь будет карта (WebView/Mapbox/Leaflet)</Text>
      </View>
    </View>
  )
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode="center-aligned">
        <Appbar.Content title="Настройки" />
      </Appbar.Header>
      <View style={{ padding: 16, gap: 12 as any }}>
        <Card>
          <Card.Content>
            <Text>Тут переключатели, выбор района, логин и т.д.</Text>
          </Card.Content>
        </Card>
      </View>
    </View>
  )
}

// нижний таб-бар (react-router-dom)
function BottomTabs() {
  const location = useLocation()
  const navigate = useNavigate()

  const items = [
    { to: '/orders', label: 'Заказы', Icon: ClipboardList },
    { to: '/map', label: 'Карта', Icon: MapIcon },
    { to: '/settings', label: 'Настройки', Icon: SettingsIcon }
  ]

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 56,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.08)',
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
      }}
    >
      {items.map(({ to, label, Icon }) => {
        const active = location.pathname === to
        return (
          <NavLink
            key={to}
            to={to}
            onClick={(e) => {
              e.preventDefault()
              navigate(to)
            }}
            style={{
              textDecoration: 'none',
              color: active ? '#0ea5e9' : '#444',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              verticalAlign: 'middle'
            }}
          >
            <Icon size={20} color={active ? '#0ea5e9' : '#444'} />
            <span style={{ fontSize: 13 }}>{label}</span>
          </NavLink>
        )
      })}
    </View>
  )
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <BrowserRouter>
        {/* резерв под нижнюю панель */}
        <View style={{ flex: 1, paddingBottom: 56 as any }}>
          <Routes>
            <Route path="/" element={<OrdersScreen />} />
            <Route path="/orders" element={<OrdersScreen />} />
            <Route path="/map" element={<MapScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
          <BottomTabs />
        </View>
      </BrowserRouter>
    </PaperProvider>
  )
}
