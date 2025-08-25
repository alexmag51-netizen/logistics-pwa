import * as React from 'react'
import { View } from 'react-native'

export type EdgeInsets = { top: number; right: number; bottom: number; left: number }
export type Frame = { x: number; y: number; width: number; height: number }

const zeroInsets: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 }

export const SafeAreaInsetsContext = React.createContext<EdgeInsets>(zeroInsets)

export const initialWindowMetrics = {
  frame: {
    x: 0,
    y: 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  },
  insets: zeroInsets
}

export function SafeAreaProvider({
  children,
  initialMetrics
}: {
  children: React.ReactNode
  initialMetrics?: typeof initialWindowMetrics
}) {
  const insets = initialMetrics?.insets ?? zeroInsets
  return React.createElement(SafeAreaInsetsContext.Provider, { value: insets }, children)
}

export function SafeAreaView(props: any) {
  return React.createElement(View, props)
}

export function useSafeAreaInsets(): EdgeInsets {
  const ctx = React.useContext(SafeAreaInsetsContext)
  return ctx ?? zeroInsets
}

export function useSafeAreaFrame(): Frame {
  return {
    x: 0,
    y: 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  }
}
