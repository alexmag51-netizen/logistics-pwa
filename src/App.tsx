// src/App.tsx
import * as React from 'react'
import { View, FlatList } from 'react-native'
import { Provider as PaperProvider, Appbar, FAB, Card, Text, Menu } from 'react-native-paper'
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
  Plus
} from 'lucide-react'
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { theme } from './theme'

// Адаптер: превращаем иконку из lucide-react в IconSource-функцию для Paper
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

  const data = [
    { id: '1', date: '2025-08-25', time: '10:00', city: 'Берлин', address: 'тестовый адрес', status: 'new' },
    { id: '2', date: '2025-08-25', time: '14:00', city: 'Берлин', address: 'тестовый адрес', status: 'in_progress' }
  ]

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

      <FlatList
        contentContainerStyle={{ padding: 16, gap: 12 as any }}
        data={data}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <Card mode="elevated">
            <Card.Title
              title={`${item.city}, ${item.address}`}
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
              <Appbar.Action icon={IconFn(Check)} onPress={() => {}} />
            </Card.Actions>
          </Card>
        )}
      />

      <FAB icon={IconFn(Plus)} style={{ position: 'absolute', right: 20, bottom: 76 }} onPress={() => {}} label="Новый" />
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

// Простой нижний таб-бар на react-router-dom
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
        position: 'fixed',
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
              gap: 6
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
