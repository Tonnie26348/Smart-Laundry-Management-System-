/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: { Row: any, Insert: any, Update: any }
      services: { Row: any, Insert: any, Update: any }
      laundry_items: { Row: any, Insert: any, Update: any }
      customers: { Row: any, Insert: any, Update: any }
      orders: { Row: any, Insert: any, Update: any }
      order_items: { Row: any, Insert: any, Update: any }
      audit_logs: { Row: any, Insert: any, Update: any }
      order_item_defects: { Row: any, Insert: any, Update: any }
      deliveries: { Row: any, Insert: any, Update: any }
      payments: { Row: any, Insert: any, Update: any }
      inventory_items: { Row: any, Insert: any, Update: any }
      inventory_transactions: { Row: any, Insert: any, Update: any }
      notifications: { Row: any, Insert: any, Update: any }
      suppliers: { Row: any, Insert: any, Update: any }
      reviews: { Row: any, Insert: any, Update: any }
      loyalty_transactions: { Row: any, Insert: any, Update: any }
    }
    Functions: {
      update_stock: { Args: { item_id: string, quantity: number, type: string }, Returns: void }
      get_dashboard_metrics: { Args: {}, Returns: { today_orders: number, pending_orders: number, completed_orders: number, total_revenue: number, active_customers: number, low_stock_items: number }[] }
    }
  }
}
